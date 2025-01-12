let readline = require("readline")
let fs = require("fs")
const { trace } = require("console")
let f1 = fs.createReadStream("./input3.txt", "utf-8")
let rl = readline.createInterface({
    // input : process.stdin,
    input: f1,
    output: process.stdout,
    terminal: false
})


class CoordinateHelper {
    static cartesianToIndeces(x, y) {
        return [8 - y, x - 1]
    }
    static indecesToCartesian(r, c) {
        return [c + 1, 8 - r]
    }

}




class User {
    username = ""
    password = ""
    wins = 0
    draws = 0
    losses = 0
    score = 0
    static users = []

    constructor(username, password) {
        this.username = username
        this.password = password


    }

    static updateScore = (username, result) => {
        let user = this.users.find((user) => user.username == username)
        if (user) {
            let winPoints = 0
            let lossPoints = 0
            let drawPoints = 0

            if (result == "win") {
                winPoints = 1
                user.score += 3
            }
            else if (result == "loss") {
                lossPoints = 1
                user.score += 0
            }
            else if (result == "draw") {
                drawPoints = 1
                user.score += 1
            }
            else if (result == "forfeit-win") {
                winPoints = 1
                user.score += 2
            }
            else if (result == "forfeit-loss") {
                lossPoints = 1
                user.score -= 1
            }

            user.wins += winPoints
            user.losses += lossPoints
            user.draws += drawPoints
        }
    }


    static scoreboard = () => {


        let sorted = this.users.sort(function (a, b) {
            if (a.score > b.score) {
                return -1
            } else if (a.score < b.score) {
                return 1
            } else {
                if (a.wins > b.wins) {
                    return -1
                } else if (a.wins < b.wins) {
                    return 1
                } else {
                    if (a.draw > b.draw) {
                        return -1
                    } else if (a.draw < b.draw) {
                        return 1
                    } else {
                        if (a.losses < b.losses) {
                            return -1
                        } else if (a.losses > b.losses) {
                            return 1
                        } else {
                            if (a.username < b.username) {
                                return -1
                            } else if (a.username > b.username) {
                                return 1
                            } else {
                                return 0
                            }
                        }
                    }
                }
            }
        })


        // let sorted = this.users.sort(function (a, b){
        //     if (a.score > b.score){
        //         return -1
        //     }
        //     else if (a.score < b.score){
        //         return 1
        //     } 
        //     else{
        //         if (a.wins > b.wins){
        //             return -1
        //         }
        //         else if (a.wins < b.wins){
        //             return 1
        //         }
        //         else{

        //             if (a.draw > b.draw){
        //                 return -1
        //             }
        //             else if (a.draw < b.draw){
        //                 return 1
        //             }
        //             else{
        //                 if (a.losses < b.losses){
        //                     return -1
        //                 }
        //                 else if (a.losses > b.losses){
        //                     return 1
        //                 }
        //                 else {
        //                     return 0
        //                 }
        //             }
        //         }
        //     }
        // })

        sorted.forEach(user => {
            console.log(user.username + " " + user.score + " " + user.wins + " " + user.draws + " " + user.losses)
        })
    }

    static sortUsers = () => {
        let sorted = this.users.sort(function (a, b) {
            if (a.username < b.username) {
                return -1
            }
            if (a.username > b.username) {
                return 1
            }
            return 0
        })
        return sorted
    }

    static list = () => {
        let a = User.sortUsers()
        a.forEach(user => console.log(user.username))
    }

    static remove = (username, password) => {
        let valid = this.users.find((user) => user.username == username)
        let re = /^[a-zA-Z0-9_]*$/

        let validusername = username.search(re)
        let validpassword = password.search(re)

        if (validusername == -1) {
            console.log("username format is invalid")
            return
        } else if (validpassword == -1) {
            console.log("password format is invalid")
            return
        } else if (!valid) {
            console.log("no user exists with this username")
            return null
        } else if (valid.password != password) {
            console.log("incorrect password")
            return null
        } else {
            let find = this.users.findIndex(user => user.username == username && user.password == password)
            if (find != -1) {
                this.users.splice(find, 1)
                console.log("removed " + username + " successfully")
                return
            }
        }
    }


    static register = (username, password) => {
        let re = /^[a-zA-Z0-9_]*$/

        let validusername = username.search(re)
        let validpassword = password.search(re)

        if (validusername == -1) {
            console.log("username format is invalid")
            return
        } else if (validpassword == -1) {
            console.log("password format is invalid")
            return
        } else if (this.users.some(user => user.username.trim() == username.trim())) {
            console.log("a user exists with this username")
        } else {
            this.users.push(new User(username, password))
            console.log("register successful")
        }


    }

    static login = (username, password) => {
        let re = /^[a-zA-Z0-9_]*$/
        let valid = this.users.find((user) => user.username == username)

        let validusername = username.search(re)
        let validpassword = password.search(re)

        if (!validusername == 0) {
            console.log("username format is invalid")
            return
        } else if (!validpassword == 0) {
            console.log("password format is invalid")
            return
        } else if (!valid) {
            console.log("no user exists with this username")
            return null
        } else if (valid.password != password) {
            console.log("incorrect password")
            return null
        } else {
            console.log("login successful")
            return valid
        }



    }

}



class Chess {
    username = ""
    limit = ""
    board = []
    selectedPiece = null
    whiteUser = null
    blackUser = null
    currentPlayerColor = ""
    static SITUATION_SHOULD_MOVE = 1
    static SITUATION_ALREADY_MOVED = 2
    situation = Chess.SITUATION_SHOULD_MOVE


    constructor(whiteUser, blackUser) {
        // this.limit=limit
        this.blackUser = blackUser
        this.whiteUser = whiteUser
    }


    startGame = (username, limit) => {
        let valid = User.users.find((user) => user.username == username)
        let re = /^[a-zA-Z0-9_]*$/

        let validusername = username.search(re)

        if (validusername == -1) {
            console.log("username format is invalid")
            return
        }
        else if (!valid) {
            console.log("no user exists with this username")
            return
        }
        else if (limit < 0) {
            console.log("number should be positive to have a limit or 0 for no limit")
            return
        }
        else if (username == this.whiteUser.username) {
            console.log("you must choose another player to start a game")
            return
        }
        else{
            this.limit = limit
            this.blackUser = valid
            this.currentPlayerColor = "w"
            console.log("new game started successfully between " + this.whiteUser.username + " and " + this.blackUser.username + " with limit " + limit)
        }
    }

    forfeit = () => {
        if (this.currentPlayerColor == "w") {
            console.log("you have forfeited")
            console.log("player " + this.blackUser.username + " with color black won")
            User.updateScore(this.blackUser.username, "forfeit-win")
            User.updateScore(this.whiteUser.username, "forfeit-loss")
            this.blackUser = null
        } else {
            console.log("you have forfeited")
            console.log("player " + this.whiteUser.username + " with color white won")
            User.updateScore(this.blackUser.username, "forfeit-loss")
            User.updateScore(this.whiteUser.username, "forfeit-win")
            this.blackUser = null
        }

    }




    turn = () => {

        if (this.currentPlayerColor == "w") {
            this.currentPlayerColor = "b"
            console.log("turn completed")
            this.situation = Chess.SITUATION_SHOULD_MOVE
            this.check()

        } else {
            this.currentPlayerColor = "w"
            console.log("turn completed")
            this.situation = Chess.SITUATION_SHOULD_MOVE
            this.check()
        }

    }

    check = () => {

        let whiteKingExists = false
        let blackKingExists = false

        for (let row of this.board) {
            for (let piece of row) {
                if (piece && piece.name == "K") {
                    if (piece.color == "w") {
                        whiteKingExists = true
                    } else if (piece.color == "b") {
                        blackKingExists = true
                    }
                }
            }
        }
        
        if (!blackKingExists) {
            console.log("player " + this.whiteUser.username + " with color white won")
            User.updateScore(this.whiteUser.username, "win")
            User.updateScore(this.blackUser.username, "loss")
        }

        else if(!whiteKingExists) {
            console.log("player " + this.blackUser.username + " with color black won")
            User.updateScore(this.whiteUser.username, "loss")
            User.updateScore(this.blackUser.username, "win")
        }

        else if(this.limit>0){
            this.limit--
            if(this.limit==0){
                console.log("draw")
                User.updateScore(this.whiteUser.username, "draw")
                User.updateScore(this.blackUser.username, "draw")
            }
        }
        
    }

    select = (x, y) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(x, y)
        let selectedPiece = this.board[r][c]

        if (r > 7 || r < 0 || c > 7 || c < 0) {
            console.log("wrong coordination")
            return
        }
        else if (selectedPiece == null) {
            console.log("no piece on this spot")
            return
        }

        else if (selectedPiece.color !== this.currentPlayerColor) {
            console.log("you can only select one of your pieces")
            return
        }

        console.log("selected")
        this.selectedPiece = selectedPiece
    }


    makeMove = (x, y) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(x, y)

        if (r > 7 || r < 0 || c > 7 || c < 0) {
            console.log("wrong coordination")
            return
        }
        if (this.situation == Chess.SITUATION_ALREADY_MOVED) {
            console.log("already moved")
            return
        }
        if (this.selectedPiece == null) {
            console.log("do not have any selected piece")
            return
        }
        let b = this.selectedPiece.move(x, y, chess.board)
        if(b){
            this.situation=Chess.SITUATION_ALREADY_MOVED
        }
        else{
            this.situation=Chess.SITUATION_SHOULD_MOVE
        }
    }



    help = () => {
        if (this.whiteUser == null) {
            console.log("register [username] [password]")
            console.log("login [username] [password]")
            console.log("remove [username] [password]")
            console.log("list_users")
            console.log("help")
            console.log("exit")
        }
        else {
            console.log("new_game [username] [limit]")
            console.log("scoreboard")
            console.log("list_users")
            console.log("help")
            console.log("logout")
        }
    }


    showBoard = () => {
        this.board.forEach(row => {
            row.forEach(item => {
                if (item == null) {
                    process.stdout.write("  |")
                } else {
                    if (item == this.selectedPiece) {
                        process.stdout.write('\x1b[31m' + item.name + item.color + '\x1b[37m' + "|")

                    } else {
                        process.stdout.write(item.name + item.color + "|")
                    }
                }
            })
            console.log()
        })
    }

    // print = () => {
    //     this.board.forEach(row => {
    //         row.forEach(item => {
    //             if (item == null) {
    //                 process.stdout.write("  |")
    //             } else {
    //                 process.stdout.write(item.name + item.color + "|")
    //             }
    //         })
    //         console.log()
    //     })
    // }

    initialize = () => {
        this.board = []
        let row = [
            new Rook("b", 1, 8), new Knight("b", 2, 8),
            new Bishop("b", 3, 8), new Queen("b", 4, 8),
            new King("b", 5, 8), new Bishop("b", 6, 8),
            new Knight("b", 7, 8), new Rook("b", 8, 8)
        ]
        this.board.push(row)


        row = []
        for (let i = 1; i <= 8; i++) {
            row.push(new Pawn("b", i, 7))
        }
        this.board.push(row)

        // row = [new Pawn("b", 1, 7), new Pawn("b", 2, 7),
        // new Pawn("b", 3, 7), new Pawn("b", 4, 7),
        // new Pawn("b", 5, 7), new Pawn("b", 6, 7),
        // new Pawn("b", 7, 7), new Pawn("b", 8, 7)]
        // this.board.push(row)



        for (let i = 0; i < 4; i++) {
            row = [null, null, null, null, null, null, null, null]
            this.board.push(row)
        }


        row = []
        for (let i = 1; i <= 8; i++) {
            row.push(new Pawn("w", i, 2))
        }
        this.board.push(row)

        // row = [new Pawn("w", 1, 2), new Pawn("w", 2, 2),
        // new Pawn("w", 3, 2), new Pawn("w", 4, 2),
        // new Pawn("w", 5, 2), new Pawn("w", 6, 2),
        // new Pawn("w", 7, 2), new Pawn("w", 8, 2)]
        // this.board.push(row)



        row = [
            new Rook("w", 1, 1), new Knight("w", 2, 1),
            new Bishop("w", 3, 1), new Queen("w", 4, 1),
            new King("w", 5, 1), new Bishop("w", 6, 1),
            new Knight("w", 7, 1), new Rook("w", 8, 1)
        ]
        this.board.push(row)
    }



    // randomize = (type, count) => {


    //     for (let i = 0; i < 8; i++) {
    //         let row = [null, null, null, null, null, null, null, null]
    //         this.board.push(row)
    //     }


    //     for (let i = 0; i < count; i++) {
    //         let x = parseInt(Math.random() * 8) + 1
    //         let y = parseInt(Math.random() * 8) + 1
    //         let c = parseInt(Math.random() * 2)
    //         let t = parseInt(Math.random() * 2)
    //         let [r, c1] = CoordinateHelper.cartesianToIndeces(x, y)
    //         if (this.board[r][c1] != null) {
    //             i--
    //         } else {
    //             if (c == 0) {
    //                 c = "w"
    //             } else {
    //                 c = "b"
    //             }


    //             if (t == 0) {
    //                 let p = new type(c, x, y)
    //                 this.board[r][c1] = p
    //                 this.selectedPiece = p
    //             } else {
    //                 let p = new Pawn(c, x, y)
    //                 this.board[r][c1] = p
    //             }
    //         }

    //     }

    // }


}




class Piece {
    name = ""
    color = ""
    x = null
    y = null
    constructor(name, color, x, y) {
        this.name = name
        this.color = color
        this.x = x
        this.y = y
    }

    move = (x, y) => {

    }
}

class Rook extends Piece {
    constructor(color, x, y) {
        super("R", color, x, y)
    }

    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if ((r1 - r) ** 2 + (c1 - c) ** 2 != ((r1 - r) + (c1 - c)) ** 2) {
            console.log("can not move to the spot")
            return false
        }

        if (r1 == r) {
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[r1][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return false
                }
            }
        }
        if (c1 == c) {
            for (let i = 1; i < Math.abs(r1 - r); i++) {
                if (board[i + Math.min(r1, r)][c1] != null) {
                    console.log("can not move to the spot")
                    return false
                }
            }
        }
        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("moved")
            return true
        }
        if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
            return true
        }
        else {
            console.log("can not move to the spot")
            return false
        }

    }
}

class Knight extends Piece {
    constructor(color, x, y) {
        super("N", color, x, y)
    }


    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if ((c1 - c) ** 2 + (r1 - r) ** 2 != 5) {
            console.log("can not move to the spot")
            return false
        }

        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("moved")
            return true
        }
        if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
            return true
        }
        else {
            console.log("can not move to the spot")
            return false
        }


    }

}

class Bishop extends Piece {
    constructor(color, x, y) {
        super("B", color, x, y)
    }

    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if (Math.abs((r1 - r) / (c1 - c)) != 1) {
            console.log("can not move to the spot")
            return false
        }
        for (let i = 1; i < Math.abs(c1 - c); i++) {
            if (board[i + Math.min(r1, r)][i + Math.min(c1, c)] != null) {
                console.log("can not move to the spot")
                return false
            }
        }
        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("moved")
            return true

        }
        if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
            return true
        } else {
            console.log("can not move to the spot")
            return false
        }


    }
}

class Queen extends Piece {
    constructor(color, x, y) {
        super("Q", color, x, y)
    }

    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if (Math.abs((r1 - r) / (c1 - c)) != 1 && (r1 - r) ** 2 + (c1 - c) ** 2 != ((r1 - r) + (c1 - c)) ** 2) {
            console.log("can not move to the spot!")
            return false
        }

        if (r1 == r) {
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[r1][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return false
                }
            }
        }
        else if (c1 == c) {
            for (let i = 1; i < Math.abs(r1 - r); i++) {
                if (board[i + Math.min(r1, r)][c1] != null) {
                    console.log("can not move to the spot")
                    return false
                }
            }
        }
        else {
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[i + Math.min(r1, r)][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return false
                }
            }
        }



        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("moved")
            return true
        }
        if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
            return true
        } else {
            console.log("can not move to the spot")
            return false
        }




    }
}

class King extends Piece {
    constructor(color, x, y) {
        super("K", color, x, y)
    }


    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if ((c1 - c) ** 2 + (r1 - r) ** 2 > 2) {
            console.log("can not move to the spot")
            return false
        }

        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("moved")
            return true
        }
        if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
            return true
        } else {
            console.log("can not move to the spot")
            return false
        }


    }

}

class Pawn extends Piece {
    constructor(color, x, y) {
        super("P", color, x, y)
    }

    move = (x, y, board) => {
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if (this.color == "w") {
            if ((r - r1) == 1 && c == c1 && board[r1][c1] == null) {
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("moved")
                return true
            }
            else if ((r - r1) == 1 && Math.abs(c1 - c) == 1 && board[r1][c1] != null && this.color != board[r1][c1].color) {
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("rival piece destroyed")
                return true
            }
            else if (r == 6 && (r - r1) == 2 && c == c1) {
                for (let i = 0; i < 2; i++) {
                    if (board[Math.min(r1, r) - i][c1] != null) {
                        console.log("can not move to the spot")
                        return
                    }
                }
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("moved")
                return true

            }
            else {
                console.log("can not move to the spot")
                return false
            }
        }


        if (this.color == "b") {
            if ((r1 - r) == 1 && c == c1 && board[r1][c1] == null) {
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("moved")
                return true 
            }
            else if ((r1 - r) == 1 && Math.abs(c1 - c) == 1 && board[r1][c1] != null && this.color != board[r1][c1].color) {
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("rival piece destroyed")
                return true
            }
            else if (r == 1 && (r1 - r) == 2 && c == c1) {
                for (let i = 1; i <= 2; i++) {
                    if (board[Math.min(r1, r) + i][c1] != null) {
                        console.log("can not move to the spot")
                        return false
                    }
                }
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("moved")
                return true

            }
            else {
                console.log("can not move to the spot")
                return false
            }
        }
    }
}




let chess = new Chess()
rl.on('line', function (line) {
    let parts = line.trim().split(" ")
    if (parts[0] == "show_board" && chess.whiteUser != null) {
        chess.showBoard()

    }
    else if (parts[0] == "random") {
        chess.randomize(Pawn, 20)

    }
    else if (parts[0] == "register" && parts.length == 3) {
        username = parts[1]
        password = parts[2]
        User.register(username, password)

    }
    else if (parts[0] == "login" && parts.length == 3) {
        username = parts[1]
        password = parts[2]
        chess.whiteUser = User.login(username, password)
        chess.currentPlayerColor = "w"

    }
    else if (parts[0] == "logout" && parts.length == 1 && chess.whiteUser != null) {
        chess.whiteUser = null
        chess.blackUser = null
        console.log("logout successful")

    }
    else if (parts[0] == "list_users") {
        User.list()

    }
    else if (parts[0] == "remove" && parts.length == 3) {
        username = parts[1]
        password = parts[2]
        User.remove(username, password)

    }
    else if (parts[0] == "select" && chess.whiteUser != null) {
        let coordinates = parts[1].split(",")
        y = parseInt(coordinates[0])
        x = parseInt(coordinates[1])
        chess.select(x, y)

    }
    else if (parts[0] == "move" && chess.whiteUser != null) {
        let coordinates = parts[1].split(",")
        y = parseInt(coordinates[0])
        x = parseInt(coordinates[1])
        chess.makeMove(x, y)

    }
    else if (parts[0] == "next_turn" && chess.whiteUser != null) {
        chess.turn()

    }
    else if (parts[0] == "new_game" && parts.length == 3 && chess.whiteUser != null) {
        chess.initialize()
        username = parts[1]
        limit = parts[2]
        chess.startGame(username, limit)

    }
    else if (parts[0] == "forfeit" && chess.whiteUser != null) {
        chess.forfeit()

    }
    else if (parts[0] == "scoreboard" && chess.whiteUser != null) {
        User.scoreboard()

    }
    else if (parts[0] == "help") {
        chess.help()
    }
    else if (parts[0] == "exit") {
        console.log("program ended")
        process.exit(0)

    }
    else {
        console.log("invalid command")
    }

})

