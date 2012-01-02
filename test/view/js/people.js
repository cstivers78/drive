module.exports = function($,context,document) {
  
  $(".people").empty();

  context.people.forEach(function(person){
    $(".people").append("\
      <tr class='person'>\
        <td class='name'>"+person.name+"</td>\
        <td class='dob'>"+person.dob+"</td>\
      </tr>\
    ");
  });
};