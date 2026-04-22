:root {
    --bg:#0f172a;
    --text:#fff;
    --card:#1e293b;
}

body.light {
    --bg:#f1f5f9;
    --text:#000;
    --card:#fff;
}

body {
    background:var(--bg);
    color:var(--text);
    text-align:center;
    font-family:Arial;
}

/* CONTROLS */
#search, #themeToggle {
    padding:10px;
    margin:10px;
    border-radius:8px;
    border:none;
}

/* LEGEND */
.box {
    padding:6px 10px;
    margin:3px;
    border-radius:5px;
    display:inline-block;
    font-size:12px;
}

/* TABLE */
#table {
    display:grid;
    grid-template-columns:repeat(18, 50px);
    gap:5px;
    justify-content:center;
}

.element {
    padding:6px;
    border-radius:5px;
    cursor:pointer;
    background:var(--card);
    font-size:12px;
    transition:0.2s;
    touch-action: manipulation;
}

.element:hover {
    transform:scale(1.08);
    z-index:2;
}

/* COLORS */
.element.alkali,.box.alkali{background:#ef4444;}
.element.alkaline,.box.alkaline{background:#f97316;}
.element.transition,.box.transition{background:#eab308;}
.element.metalloid,.box.metalloid{background:#22c55e;}
.element.nonmetal,.box.nonmetal{background:#06b6d4;}
.element.halogen,.box.halogen{background:#3b82f6;}
.element.noble,.box.noble{background:#8b5cf6;}
.element.lanthanoid,.box.lanthanoid{background:#ec4899;}
.element.actinoid,.box.actinoid{background:#a855f7;}

/* MODAL */
.modal {
    position:fixed;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.7);
    opacity:0;
    pointer-events:none;
    transition:0.3s;
}

.modal.show {
    opacity:1;
    pointer-events:auto;
}

.modal-content {
    background:var(--card);
    margin:10% auto;
    padding:20px;
    width:320px;
    border-radius:10px;
    max-height:80vh;
    overflow:auto;
}

body.modal-open {
    overflow:hidden;
}

/* ORBITAL */
.orbital-box {
    display:inline-block;
    width:28px;
    height:28px;
    border:1px solid white;
    margin:2px;
    text-align:center;
}

/* SHELL MODEL */
.atom {
    position:relative;
    width:240px;
    height:240px;
    margin:20px auto;
}

.orbit {
    position:absolute;
    border:1px solid white;
    border-radius:50%;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
}

.electron-wrapper {
    position:absolute;
    top:50%;
    left:50%;
    transform-origin:center;
    animation:spin linear infinite;
}

.electron {
    width:6px;
    height:6px;
    background:#38bdf8;
    border-radius:50%;
    position:absolute;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
    }
