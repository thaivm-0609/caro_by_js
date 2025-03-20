//khai báo hằng số cho game
const X = "x";
const O = "o";
const XText = '<span class="x">x</span>';
const OText = '<span class="o">o</span>';
const WIN = "win";
const DRAW = "draw";

window.addEventListener("load", (event) => {
    init(); //gọi hàm init để khởi tạo bàn cờ ngay khi load trang
})

function init() {
    player = X; //khởi tạo người chơi đầu tiên
    matrixGame = [];
    //lấy giá trị số hàng + số cột để tạo bàn cờ
    const urlParams = new URLSearchParams(window.location.search);
    let rows = urlParams.get("rows");
    let columns = urlParams.get("columns");
    //kiểm tra số hàng/cột hợp lệ
    if (rows == "" || isNaN(Number(rows)) || columns == "" || isNaN(Number(columns))) {
        alert('Kích thước bàn cờ không hợp lệ');
        window.location.href = '/caro/index.html';
    }

    //tạo bàn cờ bằng vòng lặp for cho rows và columns
    let tableXO = document.getElementById('table_game');
    let tableContent = "";

    for(let row=0; row<rows; row++) { //chạy vòng lặp để in ra số hàng (<tr>)
        let arr = [];
        let rowHtml = '<tr>';
        for (let col=0; col<columns; col++) { //chạy vòng lặp để in ra số cột (<td>)
            arr.push("");
            rowHtml += `<td class="td_game"><div id="${row.toString()}-${col.toString()}" 
                onclick="handleClick(this.id)" class="fixed"></div></td>`;
        }
        rowHtml += '</tr>'; //thẻ đóng của hàng
        tableContent += rowHtml;
        matrixGame.push(arr);
    }

    tableXO.innerHTML = tableContent;
}

function handleClick(id) { //
    switch (processClick(id)) {
        case WIN:
            alert(`Người chơi ${player} thắng`);
            init(); //reset game mới
            break;
        case DRAW:
            alert(`Trận đấu hòa`);
            init(); //reset game mới
            break;
    }
}

function processClick(id) { //xử lý logic khi người dùng bấm vào 1 ô trên bàn cờ
    let points = id.split("-");
    console.log(points);
    if (matrixGame[Number(points[0])][Number(points[1])] == X 
        || matrixGame[Number(points[0])][Number(points[1])] == O) { //nếu như ô này đã điền rồi thì dừng, ko cho điền dè lên
        return
    }

    if (player == X) { //nếu là lượt của X thì điền dấu X
        matrixGame[Number(points[0])][Number(points[1])] = X;
        document.getElementById(id).innerHTML = XText;
    }

    if (player == O) { //nếu là lượt của X thì điền dấu X
        matrixGame[Number(points[0])][Number(points[1])] = O;
        document.getElementById(id).innerHTML = OText;
    }

    //kiểm tra kết quả thắng hoặc hòa
    if (checkWin(points)) {
        return WIN
    }

    if (checkDraw()) {
        return DRAW
    }

    //đổi lượt sau khi click: toán tử 3 ngôi: tenBien = dieuKien ? giaTriNeuTrue : giaTriNeuFalse 
    player = player == X ? O : X;
    document.getElementById('turn').innerHTML = `<span>Lượt chơi của ${player}</span>`
}

//kiểm tra theo chiều ngang: có 3 tham số đầu vào (tọa độ x, tạo độ y, player)
function getHorizontal(x,y,player) {
    let count = 1;
    for (let i=1;i<5;i++) { 
        if (y + i < matrixGame[0].length && matrixGame[x][y+i] == player) {
            count++; //nếu ô liền kề đằng sau có cùng giá trị vs ô hiện tại thì tăng biến count lên 1 đơn vị
        } else {
            break;
        }
    }
    for (let i=1;i<5;i++) {
        if (y-i >= 0 && y-i < matrixGame[0].length && matrixGame[x][y-i] == player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

//kiểm tra theo chiều dọc
function getVertical(x,y,player) {
    let count = 1;
    for (let i=1;i<5;i++) { 
        if (x + i < matrixGame.length && matrixGame[x+i][y] == player) {
            count++; //nếu ô liền kề đằng sau có cùng giá trị vs ô hiện tại thì tăng biến count lên 1 đơn vị
        } else {
            break;
        }
    }
    for (let i=1;i<5;i++) {
        if (x-i >= 0 && x-i < matrixGame.length && matrixGame[x-i][y] == player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

//kiểm tra theo hàng chéo bên trái (x,y cùng tăng/cùng giảm)
function getLeftDiagonal(x,y,player) {
    let count = 1;
    for (let i=1;i<5;i++) { 
        if (x + i < matrixGame.length && y+i < matrixGame[0].length && matrixGame[x+i][y+i] == player) {
            count++; //nếu ô liền kề đằng sau có cùng giá trị vs ô hiện tại thì tăng biến count lên 1 đơn vị
        } else {
            break;
        }
    }
    for (let i=1;i<5;i++) {
        if (x-i >= 0 && y-i>=0 
            && x-i < matrixGame.length && y-i<matrixGame[0].length
            && matrixGame[x-i][y-i] == player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

//kiểm tra theo hàng chéo (x/y tăng giảm ngược nhau)
function getRightDiagonal(x,y,player) {
    let count = 1;
    for (let i=1;i<5;i++) { //x tăng, y giảm
        if (x + i < matrixGame.length
            && y-i >= 0 && y-i < matrixGame[0].length 
            && matrixGame[x+i][y-i] == player) {
            count++; //nếu ô liền kề đằng sau có cùng giá trị vs ô hiện tại thì tăng biến count lên 1 đơn vị
        } else {
            break;
        }
    }
    for (let i=1;i<5;i++) { //x giảm, y tăng
        if (x-i >= 0 
            && x-i < matrixGame.length && y+i<matrixGame[0].length
            && matrixGame[x-i][y+i] == player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

//kiểm tra điều kiện thắng
function checkWin(points) {
    return (
        getHorizontal(Number(points[0]),Number(points[1]),player) >=5 ||//nếu hàng ngang đủ 5 ô
        getVertical(Number(points[0]),Number(points[1]),player) >=5 ||//nếu hàng dọc đủ 5 ô
        getLeftDiagonal(Number(points[0]),Number(points[1]),player)>=5 ||//nếu hàng chéo trái đủ 5 ô
        getRightDiagonal(Number(points[0]),Number(points[1]),player) >=5 //nếu hàng chéo phải đủ 5 ô
    )
}

//kiểm tra điều kiện hòa: nếu tất cả các ô không còn trống (đã đánh hết) thì là hòa
function checkDraw() {
    for(let i=0;i <matrixGame.length;i++) { //chạy theo trục x
        for (let j=0; j<matrixGame[0].length; j++) { //chạy theo trục y
            if (matrixGame[i][j] == "") { //nếu như có 1 ô chưa đánh
                return false; // chưa hòa
            }
        }
    }

    return true; //kết quả hòa
}