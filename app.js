/* =========================================================
   ADMIN CREDENTIALS
========================================================= */

const ADMIN_USERNAME = "Tejasushin";

const ADMIN_PASSWORD = "Tejasushin@7985266612";


/* =========================================================
   LOGIN STATE
========================================================= */

let adminLoggedIn = false;


/* =========================================================
   CHAPTER STORAGE
========================================================= */

let chapters =
    JSON.parse(
        localStorage.getItem(
            "communicaChapters"
        ) || "[]"
    );


/* =========================================================
   SPLASH
========================================================= */

window.addEventListener(
    "load",
    function(){

        setTimeout(
            function(){

                document
                    .getElementById("splash")
                    .classList.add("hide");

            },
            3500
        );

    }
);


/* =========================================================
   HOME
========================================================= */

function home(){

    document
        .getElementById("learningPage")
        .classList.remove("open");


    document
        .getElementById("adminPanel")
        .classList.remove("show");


    document
        .getElementById("loginOverlay")
        .classList.remove("show");


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =========================================================
   LEARNING
========================================================= */

function openLearning(){

    document
        .getElementById("learningPage")
        .classList.add("open");

    renderChapters();

}


function closeLearning(){

    document
        .getElementById("learningPage")
        .classList.remove("open");

}


/* =========================================================
   ADMIN
========================================================= */

function openAdmin(){

    if(adminLoggedIn){

        document
            .getElementById("adminPanel")
            .classList.add("show");

        renderAdmin();

        return;

    }


    document
        .getElementById("loginOverlay")
        .classList.add("show");


    setTimeout(
        function(){

            document
                .getElementById("username")
                .focus();

        },
        150
    );

}


function closeAdmin(){

    document
        .getElementById("loginOverlay")
        .classList.remove("show");


    document
        .getElementById("loginError")
        .style.display = "none";

}


/* =========================================================
   LOGIN FORM
========================================================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event){

            event.preventDefault();

            login();

        }
    );


/* =========================================================
   LOGIN
========================================================= */

function login(){

    const username =
        document
            .getElementById("username")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const error =
        document
            .getElementById("loginError");


    error.style.display = "none";


    if(
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ){

        adminLoggedIn = true;


        closeAdmin();


        document
            .getElementById("adminPanel")
            .classList.add("show");


        renderAdmin();


        document
            .getElementById("password")
            .value = "";


        showToast(
            "Admin login successful"
        );

    }

    else{

        error.innerText =
            "Incorrect username or password.";

        error.style.display =
            "block";


        const box =
            document.querySelector(".login");


        box.animate(
            [
                {transform:"translateX(0)"},
                {transform:"translateX(-8px)"},
                {transform:"translateX(8px)"},
                {transform:"translateX(-6px)"},
                {transform:"translateX(6px)"},
                {transform:"translateX(0)"}
            ],
            {
                duration:350
            }
        );


        document
            .getElementById("password")
            .select();

    }

}


/* =========================================================
   PASSWORD
========================================================= */

function togglePassword(){

    const password =
        document
            .getElementById("password");


    const button =
        document
            .getElementById("showPassword");


    if(
        password.type === "password"
    ){

        password.type = "text";

        button.innerText =
            "HIDE";

    }

    else{

        password.type = "password";

        button.innerText =
            "SHOW";

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    adminLoggedIn = false;


    document
        .getElementById("adminPanel")
        .classList.remove("show");


    document
        .getElementById("username")
        .value = "";


    document
        .getElementById("password")
        .value = "";


    document
        .getElementById("loginError")
        .style.display = "none";


    document
        .getElementById("password")
        .type = "password";


    document
        .getElementById("showPassword")
        .innerText = "SHOW";


    showToast(
        "Logged out successfully"
    );

}


/* =========================================================
   ADD CHAPTER
========================================================= */

function addChapter(){

    if(!adminLoggedIn){

        alert(
            "Please login as Admin first."
        );

        return;

    }


    const name =
        document
            .getElementById("chapterName")
            .value
            .trim();


    const pdfInput =
        document
            .getElementById("chapterPDF");


    const file =
        pdfInput.files[0];


    if(!name){

        alert(
            "Please enter the chapter name."
        );

        return;

    }


    if(!file){

        alert(
            "Please select a PDF."
        );

        return;

    }


    if(
        file.type !== "application/pdf" &&
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ){

        alert(
            "Please select a valid PDF file."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event){

            const newChapter = {

                id:Date.now(),

                name:name,

                pdfName:file.name,

                pdfData:event.target.result,

                createdAt:
                    new Date()
                        .toLocaleString()

            };


            chapters.push(
                newChapter
            );


            try{

                localStorage.setItem(
                    "communicaChapters",
                    JSON.stringify(chapters)
                );

            }

            catch(error){

                chapters.pop();

                alert(
                    "This PDF is too large for browser storage. Please use a smaller PDF."
                );

                return;

            }


            document
                .getElementById("chapterName")
                .value = "";


            document
                .getElementById("chapterPDF")
                .value = "";


            renderAdmin();

            renderChapters();


            showToast(
                "Chapter added successfully!"
            );

        };


    reader.onerror =
        function(){

            alert(
                "Unable to read the PDF."
            );

        };


    reader.readAsDataURL(file);

}


/* =========================================================
   LEARNING CHAPTERS
========================================================= */

function renderChapters(){

    const grid =
        document
            .getElementById("chapterGrid");


    const empty =
        document
            .getElementById("emptyState");


    grid.innerHTML = "";


    if(chapters.length === 0){

        empty.style.display = "flex";

        return;

    }


    empty.style.display = "none";


    chapters.forEach(
        function(chapter,index){

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "chapter";


            card.innerHTML = `

                <div class="chapter-no">
                    CHAPTER
                    ${String(index+1).padStart(2,"0")}
                </div>

                <h3>
                    ${escapeHTML(chapter.name)}
                </h3>

                <div class="pdf-name">
                    📄
                    ${escapeHTML(chapter.pdfName)}
                </div>

                <div
                    style="
                        position:relative;
                        margin-top:12px;
                        color:#98a2b3;
                        font-size:10px;
                    "
                >
                    Added
                    ${escapeHTML(chapter.createdAt)}
                </div>

                <div class="chapter-actions">

                    <button
                        class="open-pdf"
                        onclick="openPDF(${chapter.id})"
                    >
                        Open PDF →
                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


/* =========================================================
   ADMIN LIST
========================================================= */

function renderAdmin(){

    const list =
        document
            .getElementById("adminList");


    list.innerHTML = "";


    if(chapters.length === 0){

        list.innerHTML = `

            <div
                style="
                    padding:20px;
                    text-align:center;
                    color:#98a2b3;
                    font-size:12px;
                "
            >
                No chapters added yet.
            </div>

        `;

        return;

    }


    chapters.forEach(
        function(chapter,index){

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "admin-item";


            item.innerHTML = `

                <div>

                    <strong>

                        ${String(index+1).padStart(2,"0")}
                        —
                        ${escapeHTML(chapter.name)}

                    </strong>

                    <br>

                    <span>

                        📄
                        ${escapeHTML(chapter.pdfName)}

                    </span>

                </div>


                <button
                    onclick="deleteChapter(${chapter.id})"
                    style="
                        border:0;
                        background:#fff0f2;
                        color:#d9485f;
                        padding:9px 12px;
                        border-radius:9px;
                        font-weight:800;
                        font-size:10px;
                    "
                >
                    Delete
                </button>

            `;


            list.appendChild(item);

        }
    );

}


/* =========================================================
   OPEN PDF
========================================================= */

function openPDF(id){

    const chapter =
        chapters.find(
            item =>
                item.id === id
        );


    if(!chapter){

        alert(
            "Chapter not found."
        );

        return;

    }


    const newWindow =
        window.open();


    if(!newWindow){

        alert(
            "Please allow pop-ups to open the PDF."
        );

        return;

    }


    newWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHTML(chapter.name)}
            </title>

            

        </head>

        <body>

            <iframe
                src="${chapter.pdfData}"
                title="${escapeHTML(chapter.name)}"
            ></iframe>

        </body>

        </html>

    `);


    newWindow.document.close();

}


/* =========================================================
   DELETE
========================================================= */

function deleteChapter(id){

    if(!adminLoggedIn){

        alert(
            "Admin login required."
        );

        return;

    }


    const chapter =
        chapters.find(
            item =>
                item.id === id
        );


    if(!chapter){

        return;

    }


    const confirmed =
        confirm(
            `Delete "${chapter.name}"?`
        );


    if(!confirmed){

        return;

    }


    chapters =
        chapters.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        "communicaChapters",
        JSON.stringify(chapters)
    );


    renderAdmin();

    renderChapters();


    showToast(
        "Chapter deleted"
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message){

    const toast =
        document
            .getElementById("toast");


    toast.innerText =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            function(){

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Escape"){

            closeAdmin();

        }

    }
);


/* =========================================================
   INITIAL
========================================================= */

renderChapters();
