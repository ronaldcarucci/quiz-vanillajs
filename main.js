let questions = [];
let themes = [''];
let currentTheme = null;
let currentQuestion = null;
let points = 0;
let index = 0;

const shuffle = array => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

const canChangeQuestion = () => {
  return !canChose();
}

const canChose = () => {
  return document.querySelector('#propositions .proposition.correct') === null;
}

const canDoActions = () => {
  return document.querySelector('#propositions .proposition.chosen') !== null;
}

const getQuestions = async() => {
  return fetch('questions.json').then(resp => resp.json()).then(data => {
    questions = data;
    questions.forEach(q => {
      if (!themes.includes(q.theme)) {
        themes.push(q.theme);
      }
    });
    themes = themes.sort();
  })
}

const setQuestionIntoDOM = () => {
  if (currentQuestion !== null) {
    document.querySelector('#question').innerText = currentQuestion.question;
    document.querySelector('#propositions .proposition:nth-child(1)').innerText = currentQuestion.answers.a;
    document.querySelector('#propositions .proposition:nth-child(2)').innerText = currentQuestion.answers.b;
    document.querySelector('#propositions .proposition:nth-child(3)').innerText = currentQuestion.answers.c;
    document.querySelector('#propositions .proposition:nth-child(4)').innerText = currentQuestion.answers.d;
  }
}

const toggleActions = () => {
  document.querySelector('#actions').style.visibility = document.querySelector('#propositions .proposition.chosen') === null ? 'hidden' : 'visible';
}

document.addEventListener('DOMContentLoaded', () => {
  toggleActions();
  getQuestions().then(() => {
    themes[themes.indexOf('')] = 'Tous les thèmes';
    document.querySelector('#theme-selector').innerHTML = "";
    themes.forEach(theme => {
      document.querySelector('#theme-selector').innerHTML += '<div>' + theme + '</div>';
    });
    document.querySelector('#theme-selector').style.display = 'grid';

    document.querySelectorAll('#theme-selector > *').forEach(theme => {
      theme.addEventListener('click', e => {
        currentTheme = theme.innerText;
        questions = questions.filter(question => question.theme === currentTheme || currentTheme === 'Tous les thèmes');
        document.querySelector('#theme-selector').style.display = 'none';
        shuffle(questions);
        currentQuestion = questions[index++];
        setQuestionIntoDOM();
        document.querySelector('#quiz').style.display = 'block';
      });
    });
  });

  document.querySelectorAll('#propositions .proposition').forEach(proposition => {
    proposition.addEventListener('click', e => {
      if (canChose()) {
        if (document.querySelector('#propositions .proposition.chosen') !== null) {
          document.querySelector('#propositions .proposition.chosen').classList.remove('chosen');
        }
        proposition.classList.add('chosen');
        toggleActions();
      } 
    });
  });


  document.querySelector('#choice-abord').addEventListener('click', e => {
    if (canDoActions()) {
      document.querySelector('#propositions .proposition.chosen').classList.remove('chosen');
      document.querySelector('#actions').style.visibility = 'hidden';
    }
  });
  
  document.querySelector('#choice-new-question').addEventListener('click', e => {
    if (index < 10) {
      currentQuestion = questions[index++];        
      document.querySelector('#score-zone span').innerText = '' + index + '/10 - ' + (points);
      document.querySelector('#next-or-restart').style.visibility = 'hidden';
      document.querySelector('#actions').style.visibility = 'hidden';
      
      setTimeout(() => {
          document.querySelectorAll('#propositions .proposition').forEach(proposition => {
          proposition.classList.remove('chosen','correct','incorrect');
          setQuestionIntoDOM();
        });
      }, 800);
    }
    else {
      document.querySelector('#final-points').innerText = points;
      document.querySelector('#quiz').style.display = 'none';
      document.querySelector('#final-score').style.display = 'block';
    }
  });

  document.querySelector('#choice-restart').addEventListener('click', e => {
    location.reload();
  });

  document.querySelector('#choice-validation').addEventListener('click', e => {
    if (canDoActions()) {
      if (document.querySelector('#propositions .proposition.chosen').dataset.proposition === currentQuestion.answers.correct) {
        document.querySelector('#score-zone span').innerText = '' + index + '/10 - ' + (++points);
      }
      else {
        document.querySelector('#propositions .proposition.chosen').classList.add('incorrect');
      }
      document.querySelector('#propositions .proposition.chosen').classList.remove('chosen');
      document.querySelectorAll('#propositions .proposition').forEach(element => {
        if (element.dataset.proposition === currentQuestion.answers.correct)
          element.classList.add("correct");
      });
      document.querySelector('#next-or-restart').style.visibility = 'visible';
    }
  });

});

