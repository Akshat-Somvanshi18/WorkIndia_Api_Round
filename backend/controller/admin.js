import db from "../server.js";

export const createPost = (req,res)=>{

    const {category,title,author,publish_date,content,actual_content_link,image,votes} = req.body;
    const query = "INSERT INTO post (category,title,author,publish_date,content,actual_content_link,image,upvote,downvote) VALUES (?,?,?,?,?,?,?,?,?)";

    db.query(query,[category,title,author,publish_date,content,actual_content_link,image,votes.upvote,votes.downvote], (error, result)=>{

        if(error)
            res.status(401).json({status:error});
        else
        {
            if(result.affectedRows > 0)
            {
                res.status(200).json({"message": "Short added successfully","status_code": 200});
            }
            else
            {
                res.status(401).json({"status":"Could not add the post","status_code":401});
            }
        }
    });
}



