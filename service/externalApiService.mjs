

// Connection URL
import fetch from "node-fetch";

const url = 'https://www.instagram.com/';

const getEngagementTreat = (edges, numOfFollowers) => {

    const totalPost = edges.length

    let numOfLikes = 0
    let avgNumOfLikes = 0
    let numOfComments = 0
    let avgNumOfComments = 0

    edges.forEach((item)=> {
        if(item.node && item.node.edge_media_to_comment) {
            numOfComments = numOfComments + item.node.edge_media_to_comment.count
        }
        if(item.node && item.node.edge_liked_by) {
            numOfLikes = numOfLikes + item.node.edge_liked_by.count
        }
    })

    if(totalPost) {
        avgNumOfComments = numOfComments / totalPost
        avgNumOfLikes = numOfLikes / totalPost
    }



    let engagementTreat = 0
    if(numOfFollowers) {
        engagementTreat = (avgNumOfComments + avgNumOfLikes) / numOfFollowers
    }

    return engagementTreat
}

export default async (username) =>{

    const response = await fetch(`${url}${username}/`)
    const html = await response.text()

    const regex = /window\._sharedData = (.*);<\/script>/;
    const match = regex.exec(html)

    //console.log(match[1])

    if (typeof match[1] === 'undefined') {
        return ''
    }

    const data = JSON.parse(match[1])

    const name = data.entry_data.ProfilePage[0].graphql.user.full_name
    const numOfFollowers = data.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
    const engagementTreat = getEngagementTreat(data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges, numOfFollowers)

    return {name, numOfFollowers, engagementTreat}
}

