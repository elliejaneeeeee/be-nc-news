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
            const {topics} = body

            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
    test('GET 200: responds with an array of all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const {topics} = body
            
            expect(topics.length).toBe(3)
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
    test('GET 404: responds with a 404 error when path is not found', () => {
        return request(app)
        .get('/ape')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404 Error: Path not found')
        })
    })

describe('/api/articles/:article_id', () => {
    test('GET 200: responds with an article object in the correct format', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(typeof article).toBe('object')
            expect(typeof article[0].article_id).toBe('number')
            expect(typeof article[0].title).toBe('string')
            expect(typeof article[0].topic).toBe('string')
            expect(typeof article[0].author).toBe('string')
            expect(typeof article[0].body).toBe('string')
            expect(typeof article[0].created_at).toBe('string')
            expect(typeof article[0].votes).toBe('number')
            expect(typeof article[0].article_img_url).toBe('string')
        })
    })
    test('GET 200: responds with an article object with the correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article[0].article_id).toBe(1)
            expect(article[0].title).toBe('Living in the shadow of a great man')
            expect(article[0].topic).toBe('mitch')
            expect(article[0].author).toBe('butter_bridge')
            expect(article[0].body).toBe('I find this existence challenging')
            expect(article[0].created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(article[0].votes).toBe(100)
            expect(article[0].article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('GET 404: should respond with a 404 error when resource does not exist', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource Doesn't exist")
        })
    })
    test('GET 400: should respond with a 400 error when the parameter syntax is invalid', () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: Invalid Id")
        })
    })
})

describe('/api/articles', () => {
    test('GET 200: responds with an array of articles in the correct format', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body

            expect(articles.length).toBe(13)
            articles.forEach((article) => {
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.title).toBe('string')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.author).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('number')
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('GET 200: articles should be sorted in descending order by date',() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSorted({key: 'created_at', descending: true})
        })
    })
})




describe('404: Path not found', () => {
    test('GET 404: responds with a 404 error when path is not found', () => {
        return request(app)
        .get('/api/notapath')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('404 Error: Path not found')
        })
    })
})