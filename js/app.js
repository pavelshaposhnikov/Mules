/* Onload demo - dirty timeout */
let clickEvent = new Event('click');

window.addEventListener('load', function(e) {
	slowmo.dispatchEvent(clickEvent);
	burger.dispatchEvent(clickEvent);
	
	setTimeout(function(){
		burger.dispatchEvent(clickEvent);
		
		setTimeout(function(){
			slowmo.dispatchEvent(clickEvent);
		}, 3500);
	}, 5500);
});


function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    if (value >= 10) {
      return;
    }
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('price').innerHTML = value * 0.1
    document.getElementById('number').value = value;
  }

  function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    if (value <= 1) {
      return;
    }
    value--;
    document.getElementById('price').innerHTML = value * 0.1
    document.getElementById('number').value = value;
  }



  var c4 = $('.counter');

  c4.circleProgress({
    value: 0.6,
    lineCap: 'round',
    fill: {gradient: ['#67B9DB', '#67DBB6']},
    emptyFill: "#F4FAFC",
    size: 518,
    thickness: 26,
    startAngle: 4.75,
  });


  var c4 = $('.counter-tablet');

  c4.circleProgress({
    value: 0.6,
    lineCap: 'round',
    fill: {gradient: ['#67B9DB', '#67DBB6']},
    emptyFill: "#F4FAFC",
    size: 420,
    thickness: 26,
    startAngle: 4.75,
  });

  var c4 = $('.counter-mobile');

  c4.circleProgress({
    value: 0.6,
    lineCap: 'round',
    fill: {gradient: ['#67B9DB', '#67DBB6']},
    emptyFill: "#F4FAFC",
    size: 280,
    thickness: 26,
    startAngle: 4.75,
  });


  var c4 = $('.counter-small');

  c4.circleProgress({
    value: 0.6,
    lineCap: 'round',
    fill: {gradient: ['#67B9DB', '#67DBB6']},
    emptyFill: "#F4FAFC",
    size: 230,
    thickness: 21,
    startAngle: 4.75,
  });
 

/* **** FAQ ACCORDION **** */

let accordion = document.querySelector('.faq__accordion');
let items = accordion.querySelectorAll('.faq__accordion-item');
let title = accordion.querySelectorAll('.faq__accordion-title');

function toggleAccordion() {
  let thisItem = this.parentNode;
  
  items.forEach(item => {
    if (thisItem == item ) {
      // if this item is equal to the clicked item, open it.
      thisItem.classList.toggle('active');
      return;
    } 
    // otherwise, remove the open class
    item.classList.remove('active');
  });
}

title.forEach(question => question.addEventListener('click', toggleAccordion));


/* **** SMOOTH SCROLL **** */

$("[data-scroll]").on("click", function(event) {
  event.preventDefault();
      
    let elementId = $(this).data(`scroll`);
    let elementOffset = $(elementId).offset().top;
              
$("html, body").animate({
  scrollTop: elementOffset - 25
  }, 600);
});