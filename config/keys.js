if(process.env.NODE_ENV === 'production'){
    module.exports = {
        
        mongoURL: 'mongodb+srv://noor7me:Qiyaamo_4040@cluster0-7cncw.mongodb.net/test?retryWrites=true&w=majority',
        secret: 'secretKeyGoesHere'
    }
}else {
    module.exports = {
        mongoURL: 'mongodb://localhost:27017/mydb',
        secret: 'secretKeyGoesHere'
    }
}