const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0.lljed.mongodb.net/gql?retryWrites=true&w=majority'

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

mongoose.set('useCreateIndex', true)

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



const typeDefs = gql`

  type Author {
    name: String
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }

  type Mutation {
      addBook (
          title: String!
          author: String!
          published: Int!
          genres: [String!]!
      ): Book
      editAuthor(
          name: String!
          setBornTo: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login (
        username: String!
        password: String!
      ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
        if (args.author && !args.genre) {
            const author = await Author.findOne({ name: args.author })
            return Book.find({ author: author }).populate('author')
        } else if (args.genre && !args.author) { 
            return await Book.find({ genres: { $in: [args.genre]}}).populate('author')
        } else if (args.author && args.genre) { 
            const author = await Author.findOne({ name: args.author})
            return Book.find({ genres: {$in: [args.genre]},  author : author}).populate('author')
        } else { 
            return Book.find({}).populate('author')
        }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  }
  , Author: {
    bookCount: async (root, args) => {
      const author = await Author.findOne({ name: root.name })
      const authorBooks = await Book.find({ author: author})
      return authorBooks.length
    }
  },
    Mutation: {
     
      addBook: async (root, args, context) => {

        const author = await Author.findOne({ name: args.author })

        const currentUser = context.currentUser

        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }

        if (author) {
          const book = new Book({
            ...args,
            author: author
          })


          try {
            await book.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }

          return book

        }

        const newAuthor = new Author({ name: args.author })
        newAuthor.save()

        const book = new Book({
          ...args,
          author: author
        })

        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }

        return book
    },
        editAuthor: async (root, args, context) => {

            const currentUser = context.currentUser

            if (!currentUser) {
              throw new AuthenticationError("not authenticated")
            }

            const author = await Author.findOne({name : args.name})
            author.born = args.setBornTo

            try {
              await author.save()
            }
            catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args
              })
            }

            return author

        },
        createUser: (root, args) => {
          const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            
              return user.save()
              .catch(error => {
                throw new UserInputError(error.message, {
                  invalidArgs: args
                })
              })
        },
        login: async (root, args) => {

          console.log('login')
            
          const user = await User.findOne({ username: args.username })
      
          if ( !user || args.password !== 'secret' ) {
            throw new UserInputError("wrong credentials")
          }
      
          const userForToken = {
            username: user.username,
            id: user._id,
          }
      
          return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User
        .findById(decodedToken.id)

      return { currentUser }
    }
  }  
})


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


