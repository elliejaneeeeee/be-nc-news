const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')
const { articleData, commentData, topicData, userData} = require('../db/data/test-data/index')

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData })
})

afterAll(() => {
    db.end()
})

describe('/api/topics', () => {
    test('GET 200: responds with an array of all topics in the correct format', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const topics = body
            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
    test('GET 404: responds with a 404 error when path is not found', () => {
        return request(app)
        .get('/api/topic')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404 Error: Path not found')
        })
    })
})

describe('/api', () => {
    test('GET 200: responds with an object describing all of the available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({endpoints})
            })
        })
    })

    