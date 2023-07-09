const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const blogs = [{
            "title": "Voice Content and Usability", 
            "author": "Preston So",
            "url": "https://alistapart.com/article/voice-content-and-usability/",
            "likes": 415
        }]
        const likes = blogs[0].likes

        expect(listHelper.totalLikes(blogs)).toBe(likes)
    })

    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                "title": "Voice Content and Usability", 
                "author": "Preston So",
                "url": "https://alistapart.com/article/voice-content-and-usability/",
                "likes": 415
            }, 
            {
                "title": "Humility: An Essential Value",
                "author": "Justin Dauer",
                "url": "https://alistapart.com/article/humility-an-essential-value/",
                "likes": 100
            },
            {
                "title": "Personalization Pyramid: A Framework for Designing with User Data",
                "author":"Colin Eagan, Jeffrey MacIntyre",
                "url":"https://alistapart.com/article/personalization-pyramid/",
                "likes": 140
            }
        ]
        const likes = blogs[0].likes + blogs[1].likes + blogs[2].likes

        expect(listHelper.totalLikes(blogs)).toBe(likes)
    })
})


describe('favorite blog', () => {
    test('of empty is empty', () => {
        expect(listHelper.favoriteBlog([])).toEqual({})
    })

    test('when list has only one blog equals that blog', () => {
        const blogs = [{
            "title": "Voice Content and Usability", 
            "author": "Preston So",
            "url": "https://alistapart.com/article/voice-content-and-usability/",
            "likes": 415
        }]

        expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[0])
    })

    test('of a bigger list returns the favorite blog', () => {
        const blogs = [
            {
                "title": "Humility: An Essential Value",
                "author": "Justin Dauer",
                "url": "https://alistapart.com/article/humility-an-essential-value/",
                "likes": 100
            },
            {
                "title": "Voice Content and Usability", 
                "author": "Preston So",
                "url": "https://alistapart.com/article/voice-content-and-usability/",
                "likes": 415
            }, 
            {
                "title": "Personalization Pyramid: A Framework for Designing with User Data",
                "author":"Colin Eagan, Jeffrey MacIntyre",
                "url":"https://alistapart.com/article/personalization-pyramid/",
                "likes": 140
            }
        ]

        expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[1])
    })

})