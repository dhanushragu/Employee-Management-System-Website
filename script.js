const departments = ["Engineering", "Human Resources", "Design", "Marketing", "Finance"];
const seedEmployees = [
 {id:"EMP-1001",name:"Ananya Raj",email:"ananya.raj@peopledesk.demo",department:"Engineering",role:"Frontend Developer",joined:"2024-03-18",status:"Active"},
 {id:"EMP-1002",name:"Arjun Kumar",email:"arjun.kumar@peopledesk.demo",department:"Design",role:"UI/UX Designer",joined:"2023-11-06",status:"Active"},
 {id:"EMP-1003",name:"Meera S",email:"meera.s@peopledesk.demo",department:"Human Resources",role:"HR Executive",joined:"2025-01-13",status:"On Leave"},
 {id:"EMP-1004",name:"Vikram R",email:"vikram.r@peopledesk.demo",department:"Engineering",role:"Backend Developer",joined:"2024-07-22",status:"Active"},
 {id:"EMP-1005",name:"Kavya Priya",email:"kavya.priya@peopledesk.demo",department:"Marketing",role:"Marketing Specialist",joined:"2025-04-02",status:"Active"},
 {id:"EMP-1006",name:"Rahul Dev",email:"rahul.dev@peopledesk.demo",department:"Finance",role:"Accountant",joined:"2022-09-12",status:"Active"},
 {id:"EMP-1007",name:"Nila M",email:"nila.m@peopledesk.demo",department:"Engineering",role:"QA Engineer",joined:"2024-12-02",status:"Inactive"},
 {id:"EMP-1008",name:"Praveen S",email:"praveen.s@peopledesk.demo",department:"Design",role:"Visual Designer",joined:"2023-06-19",status:"Active"},
 {id:"EMP-1009",name:"Divya K",email:"divya.k@peopledesk.demo",department:"Human Resources",role:"Recruiter",joined:"2025-02-10",status:"Active"},
 {id:"EMP-1010",name:"Santhosh B",email:"santhosh.b@peopledesk.demo",department:"Engineering",role:"Full Stack Developer",joined:"2023-08-14",status:"Active"},
 {id:"EMP-1011",name:"Harini P",email:"harini.p@peopledesk.demo",department:"Marketing",role:"Content Strategist",joined:"2024-10-28",status:"Active"},
 {id:"EMP-1012",name:"Karthik V",email:"karthik.v@peopledesk.demo",department:"Finance",role:"Financial Analyst",joined:"2024-01-08",status:"Active"}
];
const storageKey = "peopledesk_employees_v1";
let employees = loadEmployees();
let toastTimer;
const $ = id => document.getElementById(id);

function loadEmployees(){ try { const saved=localStorage.getItem(storageKey); return saved ? JSON.parse(saved) : [...seedEmployees]; } catch { return [...seedEmployees]; } }
function saveEmployees(){ localStorage.setItem(storageKey, JSON.stringify(employees)); }
function escapeHTML(value){ return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
function initials(name){ return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase(); }
function statusClass(status){ return status.toLowerCase().replace(/\s+/g,"-"); }
function formatDate(date){ if(!date)return "—"; const d=new Date(date+"T00:00:00"); return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
function showToast(message){ const toast=$("toast"); toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600); }
function populateDepartmentOptions(){
 const options=departments.map(d=>`<option value="${d}">${d}</option>`).join("");
 $("department").insertAdjacentHTML("beforeend",options);
 $("departmentFilter").insertAdjacentHTML("beforeend",options);
}
function employeeCell(e){ return `<div class="employee-cell"><div class="mini-avatar">${escapeHTML(initials(e.name))}</div><div><div class="employee-name">${escapeHTML(e.name)}</div><div class="employee-email">${escapeHTML(e.email)}</div></div></div>`; }
function statusPill(status){ return `<span class="status-pill status-${statusClass(status)}">${escapeHTML(status)}</span>`; }
function renderRecent(){
 $("recentEmployees").innerHTML=employees.slice(0,5).map(e=>`<tr><td>${employeeCell(e)}</td><td>${escapeHTML(e.department)}</td><td>${statusPill(e.status)}</td></tr>`).join("");
 if(!employees.length)$("recentEmployees").innerHTML='<tr><td colspan="3" class="empty-state">No employees yet. Add your first employee.</td></tr>';
}
function renderStats(){
 $("totalStat").textContent=employees.length;
 $("activeStat").textContent=employees.filter(e=>e.status==="Active").length;
 $("leaveStat").textContent=employees.filter(e=>e.status==="On Leave").length;
 $("departmentStat").textContent=new Set(employees.map(e=>e.department)).size;
}
function renderDepartmentBars(){
 const counts=departments.map(name=>({name,count:employees.filter(e=>e.department===name).length})).filter(d=>d.count);
 const max=Math.max(1,...counts.map(d=>d.count));
 $("departmentBars").innerHTML=counts.map(d=>`<div class="department-row"><div class="department-meta"><span>${escapeHTML(d.name)}</span><span>${d.count} ${d.count===1?"employee":"employees"}</span></div><div class="bar-track"><div class="bar-fill" style="width:${d.count/max*100}%"></div></div></div>`).join("") || '<div class="empty-state">No department data available.</div>';
}
function renderEmployeeTable(){
 const query=$("searchInput").value.trim().toLowerCase(), dept=$("departmentFilter").value, status=$("statusFilter").value;
 const filtered=employees.filter(e=>(!query||[e.name,e.email,e.role,e.id].some(v=>v.toLowerCase().includes(query)))&&(!dept||e.department===dept)&&(!status||e.status===status));
 $("employeeTable").innerHTML=filtered.map(e=>`<tr><td>${employeeCell(e)}</td><td>${escapeHTML(e.id)}</td><td>${escapeHTML(e.department)}</td><td>${escapeHTML(e.role)}</td><td>${formatDate(e.joined)}</td><td>${statusPill(e.status)}</td><td><div class="action-buttons"><button class="small-action" data-edit="${escapeHTML(e.id)}">Edit</button><button class="small-action delete-action" data-delete="${escapeHTML(e.id)}">Delete</button></div></td></tr>`).join("");
 if(!filtered.length)$("employeeTable").innerHTML='<tr><td colspan="7" class="empty-state">No matching employees found.</td></tr>';
 $("recordCount").textContent=`${filtered.length} employee${filtered.length===1?"":"s"}`;
}
function renderDepartmentCards(){
 const max=Math.max(1,...departments.map(d=>employees.filter(e=>e.department===d).length));
 $("departmentCards").innerHTML=departments.map((d,i)=>{const count=employees.filter(e=>e.department===d).length;return `<article class="department-card"><div class="department-card-head"><div class="department-symbol">${["⌘","♧","✎","◈","▤"][i]}</div><div><h3>${d}</h3><p>Department team</p></div></div><div class="department-count">${count}</div><div class="department-caption">${count===1?"employee":"employees"} in this department</div><div class="bar-track"><div class="bar-fill" style="width:${count/max*100}%"></div></div></article>`}).join("");
}
function renderAll(){renderStats();renderRecent();renderEmployeeTable();renderDepartmentBars();renderDepartmentCards();}
function navigate(view){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active-view"));
 $(view+"View").classList.add("active-view");
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 $("breadcrumbCurrent").textContent=view[0].toUpperCase()+view.slice(1);
 $("sidebar").classList.remove("open");
}
function openModal(employee=null){
 $("employeeForm").reset(); $("editId").value=""; $("modalTitle").textContent=employee?"Edit employee":"Add employee";
 if(employee){$("editId").value=employee.id;$("fullName").value=employee.name;$("email").value=employee.email;$("department").value=employee.department;$("role").value=employee.role;$("joiningDate").value=employee.joined;$("status").value=employee.status;}
 else {$("status").value="Active";$("joiningDate").value=new Date().toISOString().slice(0,10);}
 $("employeeModal").classList.add("show");$("employeeModal").setAttribute("aria-hidden","false");setTimeout(()=>$("fullName").focus(),50);
}
function closeModal(){$("employeeModal").classList.remove("show");$("employeeModal").setAttribute("aria-hidden","true");}
function makeId(){let max=1000;employees.forEach(e=>{const n=Number(e.id.replace(/\D/g,""));if(n>max)max=n;});return `EMP-${max+1}`;}

document.addEventListener("click",event=>{
 const nav=event.target.closest("[data-view]");if(nav)navigate(nav.dataset.view);
 const goto=event.target.closest("[data-goto]");if(goto)navigate(goto.dataset.goto);
 const edit=event.target.closest("[data-edit]");if(edit){const e=employees.find(x=>x.id===edit.dataset.edit);if(e)openModal(e);}
 const del=event.target.closest("[data-delete]");if(del){const e=employees.find(x=>x.id===del.dataset.delete);if(e&&confirm(`Delete ${e.name} from the demo records?`)){employees=employees.filter(x=>x.id!==e.id);saveEmployees();renderAll();showToast("Employee deleted.");}}
});
$("addEmployeeBtn").addEventListener("click",()=>openModal());
$("addEmployeeTop").addEventListener("click",()=>openModal());
$("closeModal").addEventListener("click",closeModal);$("cancelModal").addEventListener("click",closeModal);
$("employeeModal").addEventListener("click",e=>{if(e.target===$("employeeModal"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("employeeForm").addEventListener("submit",e=>{
 e.preventDefault();
 const editId=$("editId").value, email=$("email").value.trim().toLowerCase();
 if(employees.some(emp=>emp.email.toLowerCase()===email&&emp.id!==editId)){showToast("An employee with this email already exists.");$("email").focus();return;}
 const record={id:editId||makeId(),name:$("fullName").value.trim(),email,department:$("department").value,role:$("role").value.trim(),joined:$("joiningDate").value,status:$("status").value};
 if(editId){employees=employees.map(emp=>emp.id===editId?record:emp);showToast("Employee details updated.");}
 else{employees.unshift(record);showToast("Employee added successfully.");}
 saveEmployees();renderAll();closeModal();
});
["searchInput","departmentFilter","statusFilter"].forEach(id=>$(id).addEventListener(id==="searchInput"?"input":"change",renderEmployeeTable));
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("helpBtn").addEventListener("click",()=>showToast("Use Employees to add, search, edit or delete demo records."));
$("themeHint").addEventListener("click",()=>showToast("This is a frontend-only demo. No server or database is connected yet."));
populateDepartmentOptions();renderAll();
