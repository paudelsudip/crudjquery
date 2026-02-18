$(function () {
  let editItem = null;

  // Initialize 3D Tilt Effect
  VanillaTilt.init(document.querySelector(".app"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
  });

  function triggerConfetti() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });
  }

  function loadData() {
    let items = JSON.parse(localStorage.getItem("groceries")) || [];
    $(".list").empty();
    
    items.forEach(item => {
      // Migration: Convert old string items to objects
      if (typeof item === 'string') {
        const now = new Date().toLocaleString();
        item = { text: item, added: now, updated: now };
      }
      renderItem(item);
    });
    // Save migrated data immediately
    saveData();
  }

  function saveData() {
    let items = [];
    $(".list li").each(function () {
      items.push($(this).data("item"));
    });
    localStorage.setItem("groceries", JSON.stringify(items));
  }

  function renderItem(item) {
    // Check if updated time is different (significant enough) or just exist
    let timestamps = `<div class="time-info"><span>Added: ${item.added}</span>`;
    if (item.updated !== item.added) {
      timestamps += `<span>Updated: ${item.updated}</span>`;
    }
    timestamps += `</div>`;

    const $li = $(`
      <li>
        <div class="item-details">
          <span class="text">${item.text}</span>
          ${timestamps}
        </div>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </li>
    `);
    
    $li.data("item", item);
    $(".list").append($li);
  }

  $(".input-box button").click(function () {
    let $input = $(".input-box input");
    let value = $input.val().trim();
    
    if (value === "") {
      $input.addClass("shake");
      setTimeout(() => $input.removeClass("shake"), 500);
      return;
    }
    
    // Remove error if valid
    $input.removeClass("shake");

    const now = new Date().toLocaleString();

    if (editItem) {
      // Update existing item
      let item = editItem.data("item");
      item.text = value;
      item.updated = now;
      editItem.data("item", item);

      // DOM Update
      editItem.find(".text").text(value);
      
      let timeHtml = `<span>Added: ${item.added}</span>`;
      if (item.updated !== item.added) {
        timeHtml += `<span>Updated: ${item.updated}</span>`;
      }
      editItem.find(".time-info").html(timeHtml);

      editItem = null;
      $(this).text("Add");
      
      // Mini confetti for update
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      
    } else {
      // Create new item
      let newItem = { text: value, added: now, updated: now };
      renderItem(newItem);
      
      // BIG confetti for new item
      triggerConfetti();
    }
    
    $(".input-box input").val("");
    saveData();
  });

  $(".list").on("click", ".delete", function () {
    $(this).closest("li").fadeOut(300, function() {
      $(this).remove();
      saveData();
    });
  });

  $(".list").on("click", ".edit", function () {
    editItem = $(this).closest("li");
    let item = editItem.data("item");
    $(".input-box input").val(item.text);
    $(".input-box button").text("Update");
    $(".input-box input").focus();
  });

  // Initial load
  loadData();
});

