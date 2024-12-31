let readline = require("readline")
let fs = require("fs")
let f1 = fs.createReadStream("./input2.txt" , "utf-8")
let rl=readline.createInterface({
    // input : process.stdin,
    input : f1,
    output : process.stdout,
    terminal:false
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
    static users = []

    constructor(username, password) {
        this.username = username
        this.password = password
        

    }

    static sortUsers=()=>{
        let sorted=this.users.sort(function (a, b) {
            if(a.username < b.username){
              return -1
            }
            if(a.username > b.username){
              return 1
            }
            return 0
        })
        return sorted
        
    }

    static list=()=>{
        let a=User.sortUsers()
        a.forEach(user=>console.log(user.username))
    }

    static remove=(username,password)=>{
        let valid=this.users.find((user)=> user.username == username)
        let re=/^[a-zA-Z0-9_]*$/

        let validusername= username.search(re)
        let validpassword= password.search(re)

        if(validusername==-1){
            console.log("username format is invalid")
            return
        }else if(validpassword==-1){
            console.log("password format is invalid")
            return
        }else if(!valid){
            console.log("no user exists with this username") 
            return null
        }else if(valid.password!=password){
            console.log("incorrect password")
            return null
        }else{
            let find=this.users.findIndex(user=>user.username==username && user.password==password)
            if(find!=-1){
                this.users.splice(find,1)
                console.log("removed "+ username +" successfully")
                return
            }
        }
    }


    static register = (username, password) => {
        let re=/^[a-zA-Z0-9_]*$/

        let validusername= username.search(re)
        let validpassword= password.search(re)

        if(validusername==-1){
            console.log("username format is invalid")
            return
        }else if(validpassword==-1){
            console.log("password format is invalid")
            return
        }else if (this.users.some(user => user.username.trim() == username.trim())) {
            console.log("a user exists with this username")
        }else {
            this.users.push(new User(username,password))
            console.log("register successful")
        }


    }

    static login = (username, password) => {
        let re=/^[a-zA-Z0-9_]*$/
        let valid=this.users.find((user)=> user.username == username)
        
        let validusername= username.search(re)
        let validpassword= password.search(re)

        if(!validusername==0){
            console.log("username format is invalid")
            return
        }else if(!validpassword==0){
            console.log("password format is invalid")
            return
        }else if(!valid){
            console.log("no user exists with this username") 
            return null
        }else if(valid.password!=password){
            console.log("incorrect password")
            return null
        }else{
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
    whiteUser= null
    blackUser= null

    constructor(whiteUser,blackUser){
        // this.limit=limit
        this.blackUser=blackUser
        this.whiteUser=whiteUser
    }


    newGame=(username,limit)=>{
        let valid=User.users.find((user)=> user.username == username)
        let re=/^[a-zA-Z0-9_]*$/

        let validusername= username.search(re)

        if(validusername==-1){
            console.log("username format is invalid")
            return
        }
        else if(!valid){
            console.log("no user exists with this username") 
            return
        }
        else if(limit<0){
            console.log("number should be positive to have a limit or 0 for no limit")
            return
        }
        else if(username==this.whiteUser.username){
            console.log("you must choose another player to start a game")
            return
        }
        
        else{
            // this.limit=limit
            this.blackUser=valid
            console.log("new game started successfully between "+ this.whiteUser.username +" and "+ this.blackUser.username +" with limit "+ limit)
        }
    }

    forfeit=()=>{
        console.log("you have forfeited")
        console.log("player "+this.blackUser.username+" with color black won")
    }

    help =()=>{
        if(this.whiteUser==null){
            console.log("register [username] [password]")
            console.log("login [username] [password]")
            console.log("remove [username] [password]")
            console.log("list_users")
            console.log("help")
            console.log("exit")
        }
        else{
            console.log("new_game [username] [limit]")
            console.log("scoreboard")
            console.log("list_users")
            console.log("help")
            console.log("logout")
        }
    }
    print = () => {
        this.board.forEach(Row => {
            Row.forEach(item => {
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

    // new_game?
    initialize = () => {
        let row = [
            new Rook("b", 1, 8), new Knight("b", 2, 8),
            new Bishop("b", 3, 8), new Queen("b", 4, 8),
            new King("b", 5, 8), new Bishop("b", 6, 8),
            new Knight("b", 7, 8), new Rook("b", 8, 8)
        ]
        this.board.push(row)


        // row = []
        // for (let i=1; i<=8; i++) {
        //     row.push(new Pawn("b", i,7))
        // }
        // this.board.push(row)

        row = [new Pawn("b", 1, 7), new Pawn("b", 2, 7),
        new Pawn("b", 3, 7), new Pawn("b", 4, 7),
        new Pawn("b", 5, 7), new Pawn("b", 6, 7),
        new Pawn("b", 7, 7), new Pawn("b", 8, 7)]
        this.board.push(row)



        for (let i = 0; i < 4; i++) {
            row = [null, null, null, null, null, null, null, null]
            this.board.push(row)
        }


        // row = []
        // for (let i=1; i<=8; i++) {
        //     row.push(new Pawn("w", i,2))
        // }
        // this.board.push(row)

        row = [new Pawn("w", 1, 2), new Pawn("w", 2, 2),
        new Pawn("w", 3, 2), new Pawn("w", 4, 2),
        new Pawn("w", 5, 2), new Pawn("w", 6, 2),
        new Pawn("w", 7, 2), new Pawn("w", 8, 2)]
        this.board.push(row)



        row = [
            new Rook("w", 1, 1), new Knight("w", 2, 1),
            new Bishop("w", 3, 1), new Queen("w", 4, 1),
            new King("w", 5, 1), new Bishop("w", 6, 1),
            new Knight("w", 7, 1), new Rook("w", 8, 1)
        ]
        this.board.push(row)

        return this.print()
    }



    randomize = (type, count) => {


        for (let i = 0; i < 8; i++) {
            let row = [null, null, null, null, null, null, null, null]
            this.board.push(row)
        }


        for (let i = 0; i < count; i++) {
            let x = parseInt(Math.random() * 8) + 1
            let y = parseInt(Math.random() * 8) + 1
            let c = parseInt(Math.random() * 2)
            let t = parseInt(Math.random() * 2)
            let [r, c1] = CoordinateHelper.cartesianToIndeces(x, y)
            if (this.board[r][c1] != null) {
                i--
            } else {
                if (c == 0) {
                    c = "w"
                } else {
                    c = "b"
                }


                if (t == 0) {
                    let p = new type(c, x, y)
                    this.board[r][c1] = p
                    this.selectedPiece = p
                } else {
                    let p = new Pawn(c, x, y)
                    this.board[r][c1] = p
                }
            }

        }

    }


}




class Piece {
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
            return
        }

        if (r1 == r) {
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[r1][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return
                }
            }
        }
        if (c1 == c) {
            for (let i = 1; i < Math.abs(r1 - r); i++) {
                if (board[i + Math.min(r1, r)][c1] != null) {
                    console.log("can not move to the spot")
                    return
                }
            }
        }
        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("piece moved")
        } else if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
        } else {
            console.log("can not move to the spot")
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
            return
        }

        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("piece moved")
        } else if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
        } else {
            console.log("can not move to the spot")
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
            return
        }
        for (let i = 1; i < Math.abs(c1 - c); i++) {
            if (board[i + Math.min(r1, r)][i + Math.min(c1, c)] != null) {
                console.log("can not move to the spot")
                return
            }
        }
        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("piece moved")
        } else if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
        } else {
            console.log("can not move to the spot")
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

        if(Math.abs((r1 - r) / (c1 - c)) != 1 && (r1 - r) ** 2 + (c1 - c) ** 2 != ((r1 - r) + (c1 - c)) ** 2) {
            console.log("can not move to the spot!")
            return
        }

        if (r1 == r) {
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[r1][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return
                }
            }
        }
        else if (c1 == c) {
            for (let i = 1; i < Math.abs(r1 - r); i++) {
                if (board[i + Math.min(r1, r)][c1] != null) {
                    console.log("can not move to the spot")
                    return
                }
            }
        }
        else{
            for (let i = 1; i < Math.abs(c1 - c); i++) {
                if (board[i + Math.min(r1, r)][i + Math.min(c1, c)] != null) {
                    console.log("can not move to the spot")
                    return
                }
            }
        }



        if(board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("piece moved")
        }else if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
        }else {
            console.log("can not move to the spot")
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
            return
        }

        if (board[r1][c1] == null) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("piece moved")
        } else if (this.color != board[r1][c1].color) {
            board[r][c] = null
            this.x = x
            this.y = y
            board[r1][c1] = this
            console.log("rival piece destroyed")
        } else {
            console.log("can not move to the spot")
        }


    }

}

class Pawn extends Piece {
    constructor(color, x, y) {
        super("P", color, x, y)
    }

    move=(x,y,board)=>{
        let [r, c] = CoordinateHelper.cartesianToIndeces(this.x, this.y)
        let [r1, c1] = CoordinateHelper.cartesianToIndeces(x, y)

        if(this.color=="w"){
            if((r-r1)==1 && c==c1 && board[r1][c1]==null){
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("piece moved")
            }
            else if((r-r1)==1 && Math.abs(c1-c)==1 && board[r1][c1]!=null && this.color != board[r1][c1].color){
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("rival piece destroyed")
            }
            else if(r==6 && (r-r1)==2 && c==c1){
                for (let i = 0; i < 2; i++) {
                    if (board[Math.min(r1, r)-i][c1] != null) {
                        console.log("can not move to the spot")
                        return
                    }
                }
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("piece moved")

            }
            else{
                console.log("can not move to the spot")
            }
        }


        if(this.color=="b"){
            if((r1-r)==1 && c==c1 && board[r1][c1]==null){
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("piece moved")
            }
            else if((r1-r)==1 && Math.abs(c1-c)==1 && board[r1][c1]!=null && this.color != board[r1][c1].color){
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("rival piece destroyed")
            }
            else if(r==1 && (r1-r)==2 && c==c1){
                for (let i = 1; i <= 2; i++) {
                    if (board[Math.min(r1, r)+i][c1] != null) {
                        console.log("can not move to the spot")
                        return
                    }
                }
                board[r][c] = null
                this.x = x
                this.y = y
                board[r1][c1] = this
                console.log("piece moved")

            }
            else{
                console.log("can not move to the spot")
            }
        }
    }
}



// let c1 = new Chess()
// c1.initialize()
// c1.randomize(Rook,20)
// c1.print()
// console.log(c1.board)
// console.log(c1.board[2][4].color)


let chess = new Chess()
rl.on('line', function (line) {
    let parts = line.trim().split(" ")
    if (parts[0] == "print") {
        chess.print()

    } else if (parts[0] == "random") {
        chess.randomize(Pawn, 20)

    } else if (parts[0] == "move") {
        x = parseInt(parts[1])
        y = parseInt(parts[2])
        chess.selectedPiece.move(x, y, chess.board)

    } else if (parts[0] == "register" && parts.length==3) {
        username =parts[1]
        password =parts[2]
        User.register(username, password)
        
    }else if (parts[0] == "login" && parts.length==3) {
        username =parts[1]
        password =parts[2]
        chess.whiteUser=User.login(username,password)

    }else if(parts[0]=="logout" && parts.length==1 ){
        chess.whiteUser=null
        chess.blackUser=null
        console.log("logout successful")

    }
    else if(parts[0]=="remove" && parts.length==3){
        username =parts[1]
        password =parts[2]
        User.remove(username,password)
        
    }
    else if(parts[0]=="new_game" && parts.length==3){
        username =parts[1]
        limit =parts[2]
        chess.newGame(username,limit)
        
    }
    else if(parts[0]=="forfeit"){
        chess.forfeit()

    }
    else if(parts[0]=="list_users"){
        User.list()

    }
    else if(parts[0] == "help"){
        chess.help()
    }
    else if(parts[0]=="exit"){
        console.log("program ended")
        process.exit(0)

    }
    else {
        console.log("invalid command")
    }

})



