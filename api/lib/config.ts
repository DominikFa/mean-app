export const config = {
    port: process.env.PORT || 3100,
    supportedPostCount: 15,
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://faliszekdominik_db_user:7sHqvocNEQfZT8jw@cluster0.i8hrhl9.mongodb.net/app?appName=Cluster0',
    jwtSecret: process.env.JWT_SECRET || ':ZfQYT{+D.@<8T4a#vF5kTJHo;PpZ[>rG>=b}>1O4w6.Seq>*LOYhAfEN<86xMViDt|L41GDg|?^CR9ILjK<Hc',
    jwtExpiration: '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'NNSHhR&ZadM}9xFB+;q^_&f!G001Dc2i#4h3|D{{(}s<?S(cS&&SGel6os}wX{9yP&6y7q6tjwr3E7bkk]!wH[',
    jwtRefreshExpiration: '16h'
};