module.exports = ($,context,document) ->
  
  $("body").append("<table><tbody class='people'></tbody></table>")

  $(".people").empty();
  
  for person in context.people
    $(".people").append("\
      <tr class='person'>\
        <td class='name'>"+person.name+"</td>\
        <td class='dob'>"+person.dob+"</td>\
      </tr>\
    ")
  