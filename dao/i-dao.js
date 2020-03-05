const knex = require('knex')({client: 'pg'});
const log = require('@bb/stack_log');
/**
 * @class
 */
class IDao {
    pool;
    queries;
    knex;
    commandHandler;
    /**
     * @constructor
     * @param {Object} config - config
     * @param {Object} commandHandler - commandHandler
     */
    constructor(config, commandHandler) {
        const {pool} = config;
        this.pool = pool;
        this.knex = knex;
        this.commandHandler = commandHandler;

        /*
         * create and decorate knex instances
         */
        this.selectCount = () => this.decorate(knex.count('*'));
        this.billingSchema = () => this.decorate(knex.withSchema('billing'));
        this.games = () => this.decorate(knex.withSchema('billing').from('games'));
        this.draws = () => this.decorate(knex.withSchema('billing').from('draw_history'));
        this.gamblers = () => this.decorate(knex.withSchema('billing').from('gamblers'));
        this.providers = () => this.decorate(knex.withSchema('billing').from('providers'));
        this.platforms = () => this.decorate(knex.withSchema('billing').from('platforms'));
        this.providerTransactions = () => this.decorate(knex.withSchema('billing').from('provider_transactions'));
        this.providerRollbacks = () => this.decorate(knex.withSchema('billing').from('provider_rollbacks'));
        this.platformTransactions = () => this.decorate(knex.withSchema('billing').from('platform_transactions'));
        this.platformRollbacks = () => this.decorate(knex.withSchema('billing').from('platform_rollbacks'));
    }

    /**
     * @param {Object} query - knex query builder
     * @returns {Object} knex query builder with method pool for postgres query pooling
     */
    decorate(query) {
        const that = this;
        query.pool = function pool(client) {
            return that.poolQuery(this, client);
        };
        query.parseParams = function parseParams(params, fieldsMapping) {
            return that.parseParams(this, params, fieldsMapping);
        };
        query.getCount = async function getCount(params, fieldsMapping) {
            return (await this
                .count('*')
                .parseParams(params, fieldsMapping)
                .pool())[0].count;
        };
        return query;
    }

    /**
     * @param {Object} query - knex queryBuilder
     * @param {Object} params - search and filter params
     * @param {String} params.limit - limit
     * @param {String} params.offset - offset
     * @param {String} params.sortName - column for sorting
     * @param {String} params.sortOrder - asc or desc
     * @param {String} params.columnFilters - convertible to array of objects, example: '[{"key":"login","type":"like","value":"5"}]'
     * @param {String} params.aggregation - if true - will use having instead where clause
     * @param {Object} fieldsMapping - key-value for fields mapping to resolve conflicts
     * @returns {Object} knex query builder with search and filter params
     */
    parseParams(query, params, fieldsMapping = {}) {
        /* eslint-disable no-param-reassign */
        const limit = parseInt(params.limit);
        const offset = parseInt(params.offset);
        const getField = field => fieldsMapping[field] || field;

        if (params.sortName && fieldsMapping[params.sortName]) {
            query = query.orderBy(getField(params.sortName), getField(params.sortOrder) || 'desc');
        }

        const method = params.aggregation ? 'having' : 'where';

        if (params.columnFilters) {
            const filters = JSON.parse(params.columnFilters);
            // eslint-disable-next-line id-length
            filters.forEach(f => {
                if (fieldsMapping[f.key]) {
                    switch (f.type) {
                        case 'between':
                            query = query[`${method}Between`](getField(f.key), [f.value.from, f.value.to]);
                            break;
                        case 'eq':
                            query = query[method](getField(f.key), f.value);
                            break;
                        case 'gt':
                            query = query[method](getField(f.key), '>', f.value);
                            break;
                        case 'gteq':
                            query = query[method](getField(f.key), '>=', f.value);
                            break;
                        case 'lt':
                            query = query[method](getField(f.key), '<', f.value);
                            break;
                        case 'lteq':
                            query = query[method](getField(f.key), '<=', f.value);
                            break;
                        case 'nteq':
                            query = query[method](getField(f.key), '!=', f.value);
                            break;
                        case 'in':
                            query = query[`${method}In`](getField(f.key), f.value);
                            break;
                        default:
                            if (f.key.indexOf('id') > -1) {
                                return;
                            }
                            query = query[method](getField(f.key), f.type, f.type === 'like' ? `%${f.value}%` : f.value);
                            break;
                    }
                }
            });
        }

        if (limit) {
            query = query.limit(limit);
        }

        if (offset) {
            query = query.offset(offset);
        }

        return query;
    }

    /**
     * Send knex query to postgres
     * @param {Object} query - knex queryBuilder
     * @param {Object} client - pg client to exec transactions
     * @returns {Object} response
     */
    async poolQuery(query, client) {
        const pgClient = client || this.pool;
        let req;
        try {
            req = query.toSQL().toNative();
            const result = await pgClient.query(req.sql, req.bindings);
            return result && result.rows;
        } catch (err) {
            log.error(err, req);
            throw new Error(err.message);
        }
    }
}

module.exports = IDao;
