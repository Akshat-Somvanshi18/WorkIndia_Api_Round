import db from "../server.js";

export const registerUser = (req,res)=>{

    const {username,password,email} = req.body;
    const query1 = "SELECT * FROM user WHERE username = ? AND email = ?";
    const query2 = "INSERT INTO user (username,password,email) VALUES (?,?,?)";

    db.query(query1,[username,email], (error, result)=>{

        if(error)
            res.status(401).json({status:error});
        else
        {
            if(result.length > 0)
            {
                res.json({status:"Account with username/email already exists"});
            }
            else
            {
                db.query(query2,[username,password,email], (error,result)=>{
                    if(error)
                        res.status(401).json({"error":error});
                    else
                        res.status(200).json({ "status": "Account successfully created","status_code": 200,"user_id": "123445"});
                })
            }
        }

    });
}


export const loginUser = ((req,res)=>{
    const {username,password} = req.body;
    const query = "SELECT * FROM user WHERE username = ? AND password = ?";
    db.query(query,[username,password], (error,result)=>{
        if(error)
          res.status(401).json({status:error});
        else
        {
            if(result.length > 0)
            {
                res.status(200).json({"status":"Login successful","status_code":200,"user_id":result[0].user_id});
            }
            else
            {
                res.status(401).json({"status":"Incorrect username/password provided. Please retry","status_code":401});
            }
        }
    })
})

export const getFeed = (req, res) => {
    const query = `SELECT post_id, category, title, author, publish_date, content, actual_content_link, image, upvote, downvote FROM post ORDER BY publish_date DESC, upvote DESC`;

    db.query(query, (error, results) => {
        if (error) {
            res.status(401).json({ status: error });
        } 
        else 
        {
            if(results.length > 0)
            {
                const shortsFeed = results.map(row => ({
                    short_id: row.post_id,
                    category: row.category,
                    title: row.title,
                    author: row.author,
                    publish_date: row.publish_date,
                    content: row.content,
                    actual_content_link: row.actual_content_link,
                    image: row.image,
                    votes: {
                        upvote: row.upvote,
                        downvote: row.downvote
                    }
                }));
                res.status(200).json(shortsFeed);
            }
            else
            {
                res.status(401).json({"status":"Could not load the feed"});
            }
            
        }
    });
};



const buildFilterQuery = (filters) => {
    let query = `SELECT post_id, category, title, author, publish_date, content, actual_content_link, image, upvote, downvote FROM post WHERE 1=1`;

    console.log(filters);
    // console.log(search);

    const filter = filters.filter;
    const search = filters.search;


    var params = [];

    if (filter) {
        if (filter.category && filter.category!="") {
            // console.log("adding category")
            query += ` AND category LIKE ?`;
            params.push(filter.category);
        }
        if (filter.upvote && filter.upvote!="") {
            // console.log("adding upvote")
            query += ` AND upvote > ?`;
            params.push(filter.upvote);
        }
    }

    if (search) {
        if (search.title && search.title!="") {
            query += ` AND title LIKE ?`;
            params.push(`%${search.title}%`);
        }
        if (search.keyword && search.keyword!="") {
            query += ` AND (title LIKE ? OR content LIKE ?)`;
            params.push(`%${search.keyword}%`, `%${search.keyword}%`);
        }
        if (search.author && search.author!="") {
            query += ` AND author LIKE ?`;
            params.push(`%${search.author}%`);
        }
    }

    console.log( { query, params });

    return { query, params };
};

export const getFeedWithfilters = (req, res) => {
    
    const filters = req.query.query ? JSON.parse(req.query.query) : {};
    // const search = req.query.query? JSON.parse(req.query.query) : {};

    const { query, params } = buildFilterQuery(filters);
    console.log(query);


    db.query(query, params, (error, results) => {
        if (error) {
            res.status(500).json({ status: error });
        } else if (results.length == 0) {
            res.status(404).json({ status: "No short matches your search criteria", status_code: 404 });
        } else {
            // res.json({query,params});
            const shortsFeed = results.map(row => ({
                post_id: row.short_id,
                category: row.category,
                title: row.title,
                author: row.author,
                publish_date: row.publish_date,
                content: row.content,
                actual_content_link: row.actual_content_link,
                image: row.image,
                votes: {
                    upvote: row.upvote,
                    downvote: row.downvote
                },
            }));
            res.status(200).json(shortsFeed);
        }
    });
};
