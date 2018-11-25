const boxAnswer = [
    { number: 1, color: "#8c1a1a" },
    { number: 2, color: "red" },
    { number: 3, color: "rgb(218, 218, 0)" },
    { number: 4, color: "#93c49f" },
    { number: 5, color: "rgb(129, 235, 8)" },
    { number: 6, color: "rgb(24, 142, 189)" },
    { number: 7, color: "rgb(32, 161, 6)" },
    { number: 8, color: "rgb(219, 26, 203)" },
    { number: 9, color: "rgb(53, 51, 51)" },
];
const pathFile = "./data.json";
let indexComponent = "<ul>";
let time;
let point = 0;
let questionNumber = 0;

let questionAndAnswerComponent = (dt, index) => {
    let answer = "";
    dt[0].data[index].answers.forEach((e, i) => { answer += `<div class="answer__number"><input type="radio" id="${i}" value="${e.answer}" name="radio-group"><label for="${i}">${i === 0 ? "A" : i === 1 ? "B" : i === 2 ? "C" : i === 3 ? "D" : null} . ${e.answer}</label></div>` });
    let component = `<div class="time">${time}</div><div class="question">
    <div class="title">
    <h3>
       Câu ${index + 1}: ${dt[0].data[index].question}
    </h3>
    </div>
    <div class="answer">
    <form>
        ${answer}
        <div style="text-align: center; margin: 20px 0 80px 0;">
        <input type="submit" value="Trả lời">
    </div>
    </form>
    </div>
    <div class="home">
        <a href="javascript:;" onclick="backToHome()">
            <img src="./house.svg" height="30px" width="30px">
        </a>
    </div></div>`
    return component;
};

let finishComponent = () => `
    <h2 style="text-align:center">Số điểm của bạn là : ${point}</2>
    <div>
    <p style="cursor:pointer" href="javascript:;" onclick="backToHome()">
        <img src="./house.svg" height="70px" width="70px">
    </p>
    </div>
`

boxAnswer.forEach((e, i) => {
    indexComponent += `<li><a href="javascript:;" style="background:${e.color}" onclick="goto(${i})">${e.number}</a></li>`;
})

indexComponent += "</ul>";

const loadComponent = (html, element) => {
    $(element).html(html);
}

const goto = (index) => {
    let questionNumberComponent = `<div class="questions__number"><h2 style="background: ${boxAnswer[index].color};">Bộ câu hỏi số</h2><a href="javascript:;" style="background:${boxAnswer[index].color}" onclick="gotoQuestion(${index + 1})">${boxAnswer[index].number}</a><div><button style="background: ${boxAnswer[index].color};" onclick="backToHome()">Trang chủ</button></div></div>`;
    loadComponent(questionNumberComponent, "#root");
}

const gotoQuestion = (id) => {
    time = 15;
    let isSubmit = false;
    loadDataFromJson(pathFile, id).then(data => {
        if (questionNumber < data[0].data.length) {
            loadComponent(questionAndAnswerComponent(data, questionNumber), "#root");
            let countdown = setInterval(() => {
                if (time > 0) {
                    time = time - 1;
                    $(".time").text(time);
                }
                if (time === 0) {
                    clearInterval(countdown);
                    if (!isSubmit) {
                        checkAnswer(data[0].data[questionNumber].answers);
                    }
                    questionNumber++;
                    setTimeout(() => {
                        gotoQuestion(id);
                    }, 500)
                }
            }, 1000)
            $("form").submit((e) => {
                e.preventDefault();
                checkAnswer(data[0].data[questionNumber].answers);
                isSubmit = true;
                time = 0;
            });
        } else {
            loadComponent(finishComponent(), "#root");
        }
    });
}

const loadDataFromJson = (pathFile, id) => new Promise((resolve, reject) => {
    $.getJSON(pathFile, (data) => {
        resolve(data.filter(q => q.number === id))
    })
})

const backToHome = () => {
    location.reload();
}

const checkAnswer = (data) => {
    let answerTrue = data.filter(a => a.isTrue);
    let input = $("form input:radio");
    let label = $("form label");
    for (let i = 0; i < input.length; i++) {
        if (input[i].value === answerTrue[0].answer) {
            $(label[i]).css({ "background-color": "blue", "color": "#fff" })
        }
        if (input[i].checked && input[i].value === answerTrue[0].answer) {
            point += 100;
        }
    }
}

$(document).ready(() => {
    loadComponent(indexComponent, "#root");
});

