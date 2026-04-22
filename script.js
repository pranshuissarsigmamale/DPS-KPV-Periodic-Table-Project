body {
  background:#0f172a;
  color:white;
  font-family:Arial;
  text-align:center;
}

#table {
  display:grid;
  grid-template-columns:repeat(18,50px);
  gap:5px;
  justify-content:center;
}

.element {
  background:#1e293b;
  padding:6px;
  border-radius:6px;
  cursor:pointer;
  font-size:12px;
}

/* POPUPS */
.modal,.compare-panel,.map-panel{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.8);
  opacity:0;
  pointer-events:none;
  transition:0.3s;
}

.modal.show,.compare-panel.show,.map-panel.show{
  opacity:1;
  pointer-events:auto;
}

.modal-content,.compare-box,.map-box{
  background:#1e293b;
  width:90%;
  max-width:600px;
  margin:5% auto;
  padding:20px;
  border-radius:10px;
}

/* HOVER */
.hover-card{
  position:fixed;
  background:#1e293b;
  padding:8px;
  border-radius:8px;
  font-size:12px;
  opacity:0;
  pointer-events:none;
}

.hover-card.show{opacity:1}

/* BAR */
.bar{
  display:flex;
  align-items:center;
  gap:8px;
}

.bar-track{
  flex:1;
  height:8px;
  background:#0f172a;
  border-radius:5px;
}

.bar-fill{
  height:100%;
  background:#38bdf8;
    }
