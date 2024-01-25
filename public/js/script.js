(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Tax btn
let taxBtn = document.getElementById('flexSwitchCheckDefault');
taxBtn.addEventListener("click",()=>{
  let taxinfos = document.getElementsByClassName("tax-info");
  for(info of taxinfos){
    if(info.style.display != "inline"){
      info.style.display = "inline";
    }else{
      info.style.display = "none";
    }
  }
});