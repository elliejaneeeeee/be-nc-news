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

describe('/api', () => {
    test('GET 200: responds with an object describing all of the available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({endpoints})
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
    test("PATCH 404: should respond with a status 404 for an valid comment id that doesn't exist", () => {
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
    test('PATCH 400: reponds with a 400 error when the field body is empty', () => {
        const input = {}

        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("400 Bad Request: missing/malformed fields")
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

describe('DELETE: /api/comments/:comment_id', () => {
    test('DELETE 204: should respond with a status 204 with no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('DELETE 204: comment should be removed from the database', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(() => {
            return db.query(`SELECT * FROM comments WHERE comment_id=1`)
        })
        .then(({rows}) => {
            expect(rows.length).toBe(0)
        })
    })
    test('DELETE 400: should respond with a status 400 for an invalid comment id', () => {
        return request(app)
        .delete('/api/comments/invalidId')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: Invalid Id")
        })
    })
    test("DELETE 404: should respond with a status 404 for an valid comment id that doesn't exist", () => {
        return request(app)
        .delete('/api/comments/999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
})

describe('GET: /api/users', () => {
    test('GET 200: responds with an array of all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users.length).toBe(4)
        })
    })
    test('GET 200: responds with an array of all users in the correct format', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            users.forEach((user) => {
                expect(typeof user.username).toBe('string')
                expect(typeof user.name).toBe('string')
                expect(typeof user.avatar_url).toBe('string')
            })
        })
    })
})

describe('GET /api/articles with topic query', () => {
    test('GET 200: responds with an array of articles matching the specified topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            const {articles} = body

            expect(articles.length).toBe(1)
            articles.forEach((article) => {
                expect(article.topic).toBe('cats')
            })
        })
    })
    test('GET 200: responds with an array of all articles when no topic is specified', () => {
        return request(app)
        .get('/api/articles?topic=')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            
            expect(articles.length).toBe(13)
        })
    })
    test('GET 404: responds with a 404 error when the topic query does not exist', () => {
        return request(app)
        .get('/api/articles?topic=IDontExist')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
    test('GET 200: responds with an empty array when the topic query does exist but there are no entries', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({"articles": []})
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('GET 200: responds with an array of articles matching the specified id including the comment count', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article[0]).toHaveProperty('comment_count')
        })
    })
})

describe('FEATURE REQ /api/articles', () => {
    test('GET 200: responds with an array of all articles sorted by the specified query', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSorted( { key: 'votes', descending: true } )
        })
    })
    test('GET 200: responds with an array of all articles sorted by date in the order specified', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSorted({ key: 'created_at', descending: false })
        })
    })
    test('GET 200: responds with an array sorted and ordered by the queries specified', () => {
        return request(app)
        .get('/api/articles?sort_by=author&&order=asc')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeSorted( {key: 'author', descending: false} )
        })
    })
    test('GET 400: responds with a 400 error when either query is invalid', () => {
        return request(app)
        .get('/api/articles?sort_by=notAQuery&&order=notAQuery')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Error: Invalid query")
        })
    })
})

describe('/api/users/:username', () => {
    test('GET 200: responds with a user object', () => {
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeObject()
            expect(body.user).toHaveProperty('username')
            expect(body.user).toHaveProperty('avatar_url')
            expect(body.user).toHaveProperty('name')
        })
    })
    test('GET 200: responds with the correct users object', () => {
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body}) => {
            const {user} = body
            expect(user.username).toBe('lurker')
            expect(user.name).toBe('do_nothing')
            expect(user.avatar_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
        })
    })
    test('GET 404: responds with a status 404 when the username cannot be found', () => {
        return request(app)
        .get('/api/users/not4User')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
})

describe('/api/comments/:comment_id', () => {
    test('GET 200: responds with the updated comment with incrementing votes', () => {
        const updatedComment = {
            comment_id: 3,
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            votes: 110,
            author: "icellusedkars",
            article_id: 1,
            created_at: "2020-03-01T01:13:00.000Z",
        }
        const input = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/comments/3')
        .send(input)
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toEqual(updatedComment)
        })
    })
    test('GET 200: responds with the updated comment with decrementing votes', () => {
        const updatedComment = {
            comment_id: 3,
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            votes: 90,
            author: "icellusedkars",
            article_id: 1,
            created_at: "2020-03-01T01:13:00.000Z",
        }
        const input = {
            inc_votes: -10
        }
        return request(app)
        .patch('/api/comments/3')
        .send(input)
        .expect(200)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toEqual(updatedComment)
        })
    })
    test('GET 400: responds with a 400 status code when the comment id is of invalid syntax', () => {
        const input = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/comments/notAnId')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: Invalid Id")
        })
    })
    test('GET 404: responds with a 404 status code when the comment id is valid but cannot be found in db', () => {
        const input = {
            inc_votes: 10
        }
        return request(app)
        .patch('/api/comments/9999999')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404 Error: Resource doesn't exist")
        })
    })
    test('GET 400: responds with a 400 error when the body is invalid', () => {
        const input = {
            inc_votes: 'cat'
        }
        return request(app)
        .patch('/api/comments/3')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: Invalid Id")
        })
    })
    test('GET 400: responds with a 400 error when the body is empty', () => {
        return request(app)
        .patch('/api/comments/3')
        .send({})
        .then(({body}) => {
            expect(body.msg).toBe("400 Bad Request: missing/malformed fields")
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

