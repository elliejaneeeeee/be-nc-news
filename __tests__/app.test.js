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


describe('GET: /api/articles/:article_id', () => {
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

describe('GET: /api/articles', () => {
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

describe('GET: /api/articles/:article_id/comments', () => {
    test('GET 200: responds with an array of comments for the specified article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments.length).toBe(11)
        })
    })
    test('GET 200: responds with an array of comments sorted by most recent first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments).toBeSortedBy('created_at')
        })
    })
    test('GET 200: responds with an array of comments with the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments[0]).toHaveProperty('comment_id')
            expect(comments[0]).toHaveProperty('votes')
            expect(comments[0]).toHaveProperty('created_at')
            expect(comments[0]).toHaveProperty('author')
            expect(comments[0]).toHaveProperty('article_id')
        })
    })
    test('GET 404: responds with a 404 error message of not found when an invalid id is specified', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
    test('GET 400: responds with a 400 error message of bad request when the specified id has a syntax error', () => {
        return request(app)
        .get('/api/articles/notAnId/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400 Bad Request: Invalid Id')
        })
    })
})

describe('POST: /api/articles/:article_id/comments', () => {
    test('POST 201: responds with the a named object containing the posted comment', () => {
        const input = {
            username: 'lurker',
            body: 'Cool article!'
        }

        return request(app)
        .post('/api/articles/1/comments')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toEqual({author: 'lurker', body: 'Cool article!'})
            expect(body.comment).toBeObject()
        })
    })
    test('POST 200: should ignore unnecessary properties in the input', () => {
        const input = {
            username: 'lurker',
            body: 'Cool article!',
            tagline: 'my cool comment'
        }

        return request(app)
        .post('/api/articles/1/comments')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.comment).not.toHaveProperty('tagline')
        })
    })
    test('POST 400: responds with a 400 error when there are missing/malformed fields', () => {
        const input = {}

        return request(app)
        .post('/api/articles/1/comments')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('400 Bad Request: missing/malformed fields')
        })
    })
    test('POST 400: responds with a 404 error when the article_id doesnt exist', () => {
        const input = {
            username: 'lurker',
            body: 'Cool article!'
        }

        return request(app)
        .post('/api/articles/99999/comments')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
    test('POST 400: responds with a 404 error when the article_id has a syntax error', () => {
        const input = {
            username: 'lurker',
            body: 'Cool article!'
        }

        return request(app)
        .post('/api/articles/notAnId/comments')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: Invalid Id")
        })
    })
    test("POST 404: responds with a 404 error when the username given doesn't exist", () => {
        const input = {
            username: 'username1',
            body: 'Cool article!'
        }

        return request(app)
        .post('/api/articles/1/comments')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
})

describe('PATCH: /api/articles/:article_id', () => {
    test('PATCH 200: should respond with an object containing the updated article with incrementing votes', () => {
        const input = {
            inc_votes: 10
        }

        const article = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 110,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }

        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({article})
        })
    })
    test('PATCH 200: should respond with an object containing the updated article with decrementing votes', () => {
        const input = {
            inc_votes: -10
        }

        const article = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 90,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }

        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({article})
        })
    })
    test('PATCH 404: reponds with a 404 error when the article with the specified ID cannot be found', () => {
        const input = {
            inc_votes: -10
        }

        return request(app)
        .patch('/api/articles/999999999')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual("404 Error: Resource doesn't exist")
        })
    })
    test('PATCH 404: reponds with a 404 error when the article id is invalid', () => {
        const input = {
            inc_votes: -10
        }

        return request(app)
        .patch('/api/articles/invalidId')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("400 Bad Request: Invalid Id")
        })
    })
    test('PATCH 404: reponds with a 404 error when the field body is empty', () => {
        const input = {}

        return request(app)
        .patch('/api/articles/invalidId')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("400 Bad Request: Invalid Id")
        })
    })
    test('PATCH 404: reponds with a 404 error when the field body is an invalid value', () => {
        const input = {
            inc_votes: 'minus ten'
        }

        return request(app)
        .patch('/api/articles/invalidId')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("400 Bad Request: Invalid Id")
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