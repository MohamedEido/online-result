const myInput = document.querySelector('.input');
const button = document.querySelector('.button');
const loader = document.querySelector('.spinner');
const department = document.querySelector('.department');
const resultBox = document.querySelector('.result-box');
const note = document.querySelector('.note');
let result = [];
let link;

// validate the input value
myInput.addEventListener('keyup', () => {
  if (myInput.value == '') {
    note.classList.add('hide');
    button.classList.add('clicked');
  } else if (myInput.value.length < 10 || myInput.value.length > 10) {
    note.classList.remove('hide');
    button.classList.add('clicked');
  } else {
    note.classList.add('hide');
    button.classList.remove('clicked');
  }
});

button.addEventListener('click', () => {
  const studentId = myInput.value;

  // show the loader and hide the result box
  resultBox.classList.add('active');
  loader.classList.remove('loaded');
  button.classList.add('clicked');

  // choose spicific department
  if (department.value == 'it') {
    link = 'it';
  } else if (department.value == 'is') {
    link = 'is';
  } else if (department.value == 'cs') {
    link = 'cs';
  }

  // load the json file
  loadResult();

  // insert the filtered result
  const interval = setInterval(() => {
    if (result.length > 0) {
      const filteredResult = result.filter((item) => {
        return item.phone.includes(studentId);
      });

      // check if there are items found
      if (filteredResult.length > 0) {
        displayResult(filteredResult);
      } else {
        const noItemsMsg = `<p class="error-msg">حدث خطأ, الرجاء التأكد من صحة البيانات المدخلة والمحاولة مرة اخرى</p>`;
        resultBox.innerHTML = noItemsMsg;
      }
    }
  }, 1500);

  // show the result box after the content is loaded
  resultBox.addEventListener('DOMSubtreeModified', () => {
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('loaded');
      resultBox.classList.remove('active');
      button.classList.remove('clicked');
    }, 3000);
  });

});

// load result from json file
const loadResult = async function () {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    result = await res.json();
    // console.log(result);
  } catch (error) {
    const errorMsg = `<p class="error-msg">حدث خطأ في الشبكة, الرجاء المحاولة مرة اخرى</p>`;
    resultBox.innerHTML = errorMsg;
    console.error(error);
  }
};

// display result inside html body
const displayResult = function (result) {
  let resultBody = result.map((item) => {
    return `
    <div class="result">
      <!-- Student info -->
      <div class="content">
        <h3>تفاصيل النتيجة :</h3>
        <div class="box">
          <span class="icon user"><img src="assets/images/user.svg" alt="User"></span>
          <p class="value">${item.name}</p>
        </div>
        <div class="wrapper">
          <div class="box">
            <span class="icon hashtag"><img src="assets/images/hashtag.svg" alt="hashtag"></span>
            <p class="value">${item.phone}</p>
          </div>
          <div class="box">
            <span class="icon minus"><img src="assets/images/minus.svg" alt="minus"></span>
            <p class="value">${item.username}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Result Body -->
    <div class="result-body">
      <ul class="result-content">
        <li><span class="subject">القران الكريم</span><!----><span class="degree">ممتاز</span></li>
        <li><span class="subject">القران الكريم</span><!----><span class="degree">ممتاز</span></li>
        <li><span class="subject">القران الكريم</span><!----><span class="degree">ممتاز</span></li>
      </ul>
    </div>`
  });
  resultBody = resultBody.join('');
  resultBox.innerHTML = resultBody;
};