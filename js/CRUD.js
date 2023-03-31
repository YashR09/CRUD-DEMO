window.onload = function () {
  document.getElementById("record-dom").hidden = true;
};

var recordId;
notification = false;

function savedata() {
  if (validate() == true) {
    if (notification == true) {
      var loginForm = $.parseJSON(sessionStorage.getItem("loginForm"));

      var updateObject = loginForm.map((obj) => {
        if (obj.id == recordId) {
          obj.Name = $("#name").val();
          obj.Email = $("#email").val();
          obj.Phone = $("#phone").val();
          obj.Message = $("#message").val();
          obj.imageName = document.getElementById("file").files[0];
        }
        return obj;
      });

      var loginForm = JSON.stringify(loginForm);
      sessionStorage.setItem("loginForm", loginForm);
      var updatedObject = JSON.parse(sessionStorage.getItem("loginForm"));
      showDataInTable(updatedObject);

      $("#loginForm").trigger("reset");
    } else {
      var sessionData = sessionStorage.getItem("loginForm");
      var name = $("#name").val();
      var email = $("#email").val();
      var phone_no = $("#phone").val();
      var message = $("#message").val();
      var fileName = document.getElementById("file").files[0];
      var id = Math.random();
      const reader = new FileReader();
      reader.onload = function (e) {
        var sessionDataForUrl = JSON.parse(sessionStorage.getItem("loginForm"));

        var updatedData = sessionDataForUrl.map((data) => {
          if (data.uniqueId == id) {
            data.imageUrl = e.currentTarget.result;
          }
          return data;
        });
        sessionStorage.setItem("loginForm", JSON.stringify(updatedData));
        showDataInTable(updatedData);
      };
      reader.readAsDataURL(fileName);
      var data = {
        Name: name,
        Email: email,
        Phone: phone_no,
        Message: message,
        imageName: fileName.name,
        imageUrl: reader.result,
        uniqueId: id,
      };
      var loginForm = JSON.stringify(data);
      if (sessionData === null) {
        let loginForm = [];
        data.id = 0;
        loginForm.push(data);
        sessionStorage.setItem("loginForm", JSON.stringify(loginForm));
      } else {
        var form = JSON.parse(sessionStorage.getItem("loginForm"));
        data.id = form.length;
        form.push(data);
        loginForm = JSON.stringify(form);
        sessionStorage.setItem("loginForm", loginForm);
        showDataInTable(form);
      }
      $("#loginForm").trigger("reset");
      document.getElementById("record-dom").hidden = false;
    }
  }
}

function showDataInTable(form) {
  var dataInSession = "";
  for (data of form) {
    dataInSession += `
        <tr class = "text-center">
        <td id="id">${data.id}</td>
        <td id= "name">${data.Name}</td>
        <td id= "email">${data.Email}</td>
        <td id= "phone">${data.Phone}</td>
        <td id= "message">${data.Message}</td>
        <td id= "Files"><div class="row ">
        <img src="${data.imageUrl}" alt="" class="imageDiv">
    </div>
    <div class="row btn btn-outline-primary imageBtn">
      <a href="${data.imageUrl}" target="_blank" class="autofill text-dark text-decoration-none">${data.imageName}</a>
    </div>
        
        </td>
        <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(${data.id})">Delete</button> 
         <button type="button" class="btn btn-outline-info" onclick="updateRow(${data.id})">Update</button></td>
        </tr>
        `;
  }
  $("#formdata").html(dataInSession);
}

function deleteRow(recordId) {
  var notification = confirm("Do you want to delete?");
  if (notification == true) {
    var form = $.parseJSON(sessionStorage.getItem("loginForm"));
    var deleteIndex = form.findIndex((item) => item.id == recordId);
    form.splice(deleteIndex, 1);

    var loginForm = JSON.stringify(form);
    sessionStorage.setItem("loginForm", loginForm);
    var updatedform = JSON.parse(sessionStorage.getItem("loginForm"));

    showDataInTable(updatedform);
    const recordData = sessionStorage.getItem("loginForm");
    var xyz = JSON.parse(recordData);
    if (xyz.length > 0) {
      document.getElementById("record-dom").hidden = false;
    } else {
      document.getElementById("record-dom").hidden = true;
    }
  }
}

function updateRow(id) {
  recordId = id;
  form = JSON.parse(sessionStorage.getItem("loginForm"));
  notification = confirm("Do you want to Update Your data?");
  $("#name").val(form[id].Name);
  $("#email").val(form[id].Email);
  $("#phone").val(form[id].Phone);
  $("#message").val(form[id].Message);
  document.getElementById("file").files[form[id].imageName];
}

function validate() {
  let nameValidate = $("#name").val();
  let emailValidate = $("#email").val();
  let phoneValidate = $("#phone").val();

  let regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  let regEmail =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  let regPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (nameValidate == "") {
    alert("Please Enter Your Name!");
    // return false;
  } else if (!regName.test(nameValidate)) {
    alert("Please Enter Valid Name!");
    // return false;
  }
  if (emailValidate == "") {
    alert("Please Enter Your Email!");
    // return false;
  } else if (!regEmail.test(emailValidate)) {
    alert("Please Enter Valid Email!");
    // return false;
  }
  if (phoneValidate == "") {
    alert("Please Enter Your Phone Number!");
    // return false;
  } else if (!regPhone.test(phoneValidate)) {
    alert("Please Enter Valid Phone Number!");
    return false;
  } else {
    return true;
  }
}
