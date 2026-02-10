 //要素の呼び出し
    const input = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("taskList");
    
    // 保存されたタスクを読み込み（一番下のスクリプトで保存している）
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    // forEachでsavedに保存されているテキストをひとつずつaddTaskに渡す
    saved.forEach(addTask);

    addBtn.addEventListener("click", () => {
      if (!input.value.trim()) return;
      addTask(input.value);
      saveTasks();
      input.value = "";
    });

    // text には addTask を呼び出した側が渡した文字列が入る 
    // saved.forEach(addTask) のとき → saved の各要素 
    // addTask(input.value) のとき → ユーザーが入力した文字
    function addTask(text) {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
    

    //表示用のspan
      const span = document.createElement("span");
      span.textContent = text;

      li.appendChild(checkbox);
      li.appendChild(span);
      list.appendChild(li);
      
    //編集用のinput(最初は非表示)
      const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = text;
        editInput.style.display = "none";

          li.appendChild(editInput);

      checkbox.addEventListener("change", () => {
        li.classList.toggle("completed", checkbox.checked);
      
        if (navigator.vibrate) {
          navigator.vibrate(50);
        };
        saveTasks();
    });

    //編集開始(spanをクリック)
      span.addEventListener('click', () => {
        span.style.display = "none";
        editInput.style.display = "inline-block";
        editInput.focus();
    });

    //編集した内容を保存
       editInput.addEventListener("blur", () => {
        span.textContent = editInput.value;
        editInput.style.display = "none";
        span.style.display = "inline";
        saveTasks();
    });
  };

    const deleteBtn = document.getElementById("deleteBtn");

    deleteBtn.addEventListener("click", () => {
      const items = document.querySelectorAll("#taskList li");

      //チェック済みのリストのみを集める
      const targets = [...items].filter(li => {
        const delcheckbox = li.querySelector("input[type='checkbox']");
        return delcheckbox && delcheckbox.checked;
      });

      //削除対象がない場合
      if (targets.length === 0) {
        alert("削除するタスクを選択してください");
        return;
      };

      const Ok = window.confirm(`${targets.length}件のタスクを削除しますか？`);
      if (!Ok) return;

      //削除を実行
      targets.forEach(li => li.remove());

      saveTasks();
    });

    //追加されたタスクをページを閉じても消えないように保存する
    //list.children(liの集まり)を配列に変換し
    //各liの最初のテキスト（タスク名）だけを取り出して配列にする
    function saveTasks() {
      const tasks = [...list.children].map(li => {
        const span = li.querySelector("span");
        const input = li.querySelector("input[type='text']");

        if (input.style.display !== "none") {
          return input.value;
        } else {
          return span.textContent;
        };
      });
    
      //"tasks"という引き出しの中に、JSON.stringify(tasks)という中身を入れるイメージ
      localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    //ドラッグアンドドロップの実行
      new Sortable(list, {
      animation: 150,
      onEnd: () => saveTasks()
    });




