module.exports = ($,context,document) ->

  $("title").replaceWith("Hello Bob")

  $(".people").empty();
  
  for person in context.people
    $(".people").append("\
      <tr class='person'>\
        <td class='name'>"+person.name+"</td>\
        <td class='dob'>"+person.dob+"</td>\
      </tr>\
    ")
  
  return