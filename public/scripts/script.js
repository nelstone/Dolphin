function openModal() {
    document.getElementById("myModal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("myModal").style.display = "none";
  }
  
  var slideIndex = 1;
  showSlides(slideIndex);
  
  function plusSlides(n) {
    showSlides(slideIndex += n);
  }
  
  function currentSlide(n) {
    showSlides(slideIndex = n);
  }
  
  function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
  }

  function displaySchedules(){
    document.getElementById('scheduleselector').style.display = 'flex';
  }
  function selectSchedule(){
    let scheduleOpts = document.getElementsByName('scheduleoption');
    for(let i = 0; i < scheduleOpts.length; i++){
      if(scheduleOpts[i].checked){
        document.getElementById('schedule-input').value = scheduleOpts[i].value;
        document.getElementById('scheduleselector').style.display = 'none';
        document.getElementById('schedule-error').innerHTML = "";
      }
      else if(scheduleOpts[i].checked == false){
        document.getElementById('schedule-error').innerHTML = "Please select a time schedule";
        document.getElementById('schedule-btn').style.transform = 'translate(-40px)';
        setTimeout(() => {
          document.getElementById('schedule-btn').style.transform = 'translate(40px)';
        }, '0100');
        setTimeout(() => {
          document.getElementById('schedule-btn').style.transform = 'translate(0px)';
        }, '0200');
      }
    }
  }

  function showActivities(){
    document.getElementById('activityselector').style.display = 'flex';
  }

  function selectActivity(){
    let activityOpts = document.getElementsByName('activityoption');
    for(let i = 0; i < activityOpts.length; i++){
      if(activityOpts[i].checked){
        document.getElementById('activityselector').style.display = 'none';
        document.getElementById('activities-input').value = activityOpts[i].value;
      }
      else if (activityOpts[i].checked == false){
        document.getElementById('activity-error').innerHTML = "Please select an activity";
        document.getElementById('activity-btn').style.transform = 'translate(-40px)';
        setTimeout(() => {
          document.getElementById('activity-btn').style.transform = 'translate(40px)';
        }, '0100');
        setTimeout(() => {
          document.getElementById('activity-btn').style.transform = 'translate(0px)';
        }, '0200');
      }
    }
  }


  document.getElementById('adult+').addEventListener('click', function(){
    document.getElementById('AdultNo').value++;
  });

  document.getElementById('adult-').addEventListener('click', function(){
    document.getElementById('AdultNo').value--;
    if (document.getElementById('AdultNo').value < 0){
      document.getElementById('AdultNo').value = 0;
    }
  });

  document.getElementById('child+').addEventListener('click', function(){
    document.getElementById('ChildNo').value++;
  });

  document.getElementById('child-').addEventListener('click', function(){
    document.getElementById('ChildNo').value--;
    if (document.getElementById('ChildNo').value < 0){
      document.getElementById('ChildNo').value = 0;
    }
  });

let formInputsArray = [document.getElementById('firstname'),document.getElementById('lastname'), document.getElementById('email'), document.getElementById('schedule-input'), document.getElementById('activities-input'), document.getElementById('AdultNo'), document.getElementById('ChildNo'), document.getElementById('date')];


  // for(let k = 0; k < formInputsArray; k++){
  //   if(formInputsArray[k].value.length == 0){
  //     document.getElementById('totalprice').style.display = 'none';
  //     alert(formInputsArray[2].value.length)
  //   }
  // }

function disabledSetting(){
  if( document.getElementById('submit-btn').disabled == true || document.getElementById('submit-btn').disabled === true ){
    document.getElementById('submit-btn').style.opacity = '0.5';
  }
}
disabledSetting();


function totalCalculator(){

  let royalswim = '141.75';
  let swimadventure = '111.75';
  let encouter = '89.25';
  let dolphinday = '35.10';

  let adultNo = parseInt(document.getElementById('AdultNo').value);
  let childNo = parseInt(document.getElementById('ChildNo').value);

  let finalTotal = 0;
  let adultTotal = 0;
  let childTotal = 0;

  let pricesArr = [royalswim, swimadventure, encouter, dolphinday]
  let selectValuesArr = ['DOLPHIN ROYAL SWIM','DOLPHIN SWIM ADVENTURE', 'DOLPHIN ENCOUTER', 'A DAY AT DOLPHIN COVE'];

  for(let i = 0; i < selectValuesArr.length; i++){
    if(selectValuesArr[i] == document.getElementById('activities-input').value){
      adultTotal = (pricesArr[i] * adultNo);
      childTotal = (pricesArr[i] * childNo);
      finalTotal = adultTotal + childTotal;
    }
  }
  document.getElementById('totalprice').innerHTML = `ADULT TOTAL: ${adultTotal} <br> Children's Total: ${childTotal} <br> Final Total: ${finalTotal}`
  
}



setInterval(() => {
  let inputs = document.getElementsByClassName('form-control');
  let disabledVal = false;

  for(let i = 0; i < inputs.length; i++){
    if(inputs[i].value == "" || inputs[i].value === "" || inputs[i].value == null || inputs[i].value === null){
      disabledVal = false;
    }else{
      disabledVal = true;
    }
  }
  if (disabledVal == true){
    document.getElementById('submit-btn').style.opacity = '1';
    document.getElementById('submit-btn').disabled = false;
    totalCalculator();
  }
}, 6000);



