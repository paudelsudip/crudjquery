$(function () {
  let editItem = null;

  $(".input-box button").click(function () {
    let value = $(".input-box input").val().trim();
    if (value === "") return;

    if (editItem) {
      editItem.find(".text").text(value);
      editItem = null;
      $(this).text("Add");
    } else {
      $(".list").append(`
        <li>
          <span class="text">${value}</span>
          <div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        </li>
      `);
    }
    $(".input-box input").val("");
  });

  $(".list").on("click", ".delete", function () {
    $(this).closest("li").remove();
  });

  $(".list").on("click", ".edit", function () {
    editItem = $(this).closest("li");
    let text = editItem.find(".text").text();
    $(".input-box input").val(text);
    $(".input-box button").text("Update");
  });
});
function saveData() {
  let items = [];
  $(".list .text").each(function () {
    items.push($(this).text());
  });
  localStorage.setItem("groceries", JSON.stringify(items));
}

function loadData() {
  let items = JSON.parse(localStorage.getItem("groceries")) || [];
  items.forEach(item => {
    $(".list").append(`
      <li>
        <span class="text">${item}</span>
        <div>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </li>
    `);
  });
}

loadData();

$(".list, .input-box button").on("click", saveData);

