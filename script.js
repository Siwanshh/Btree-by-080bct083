// SIWANSH PATHAK 080BCT083
document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  const page = document.querySelector(".page-wrap");
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = "none";
      page.style.display = "flex";
    }, 400);
  }, 2000);

  const canvas = document.getElementById("treeCanvas");
  const ctx = canvas.getContext("2d");
  const DPR = window.devicePixelRatio || 1;

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(900, rect.width * DPR);
    canvas.height = Math.max(480, rect.height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawNodes();
  }

  new ResizeObserver(fitCanvas).observe(canvas.parentElement);
  window.addEventListener("resize", fitCanvas);

  const orderInput = document.getElementById("degree");
  const insertBtn = document.getElementById("insertBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const clearBtn = document.getElementById("clearBtn");
  const keyInput = document.getElementById("keyInput");
  const nodeCountEl = document.getElementById("nodeCount");
  const heightCountEl = document.getElementById("heightCount");
  const darkToggle = document.getElementById("darkToggle");

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    drawNodes();
  });

  const layerColors = ['#d946ef','#8b5cf6','#5a189a','#7b2cbf','#c084fc','#a855f7'];

  class BNode {
    constructor(order, leaf = true) {
      this.order = order;
      this.keys = [];
      this.children = [];
      this.leaf = leaf;
      this.x = 0;
      this.y = 0;
      this.subtreeWidth = 0;
      this.targetX = 0;
      this.targetY = 0;
    }
  }

  class BTree {
    constructor(order) {
      this.order = order;
      this.root = new BNode(order, true);
    }

    maxKeys() { return this.order - 1; }
    minKeys() { return Math.ceil(this.order / 2) - 1; }
    maxChildren() { return this.order; }
    minChildren() { return Math.ceil(this.order / 2); }

    insert(key) {
      const r = this.root;
      if (r.keys.length === this.maxKeys()) {
        const s = new BNode(this.order, false);
        s.children[0] = r;
        this.root = s;
        this.splitChild(s, 0);
        this.insertNonFull(s, key);
      } else {
        this.insertNonFull(r, key);
      }
      playSound("insert");
    }

    insertNonFull(node, key) {
      let i = node.keys.length - 1;
      if (node.leaf) {
        while (i >= 0 && key < node.keys[i]) i--;
        node.keys.splice(i + 1, 0, key);
      } else {
        while (i >= 0 && key < node.keys[i]) i--;
        i++;
        if (node.children[i].keys.length === this.maxKeys()) {
          this.splitChild(node, i);
          if (key > node.keys[i]) i++;
        }
        this.insertNonFull(node.children[i], key);
      }
    }

    splitChild(parent, i) {
      const y = parent.children[i];
      const z = new BNode(this.order, y.leaf);
      const midIndex = Math.floor(this.maxKeys() / 2);
      const midKey = y.keys[midIndex];
      z.keys = y.keys.splice(midIndex + 1);
      y.keys.splice(midIndex, 1);
      if (!y.leaf) {
        z.children = y.children.splice(midIndex + 1);
      }
      parent.children.splice(i + 1, 0, z);
      parent.keys.splice(i, 0, midKey);
      playSound("split");
    }

    // ---------- FIXED DELETE START ----------
    delete(key) {
      this._delete(this.root, key);
      if (this.root.keys.length === 0 && !this.root.leaf) {
        this.root = this.root.children[0];
      }
      playSound("delete");
    }

    _delete(node, key) {
      const minK = this.minKeys();
      let idx = node.keys.findIndex(k => k >= key);
      if (idx === -1) idx = node.keys.length;

      // Case 1: Key is in this node
      if (idx < node.keys.length && node.keys[idx] === key) {
        if (node.leaf) {
          // Leaf: remove directly
          node.keys.splice(idx, 1);
        } else {
          let pred = node.children[idx];
          let succ = node.children[idx + 1];

          if (pred.keys.length > minK) {
            let k = this.getPred(pred);
            node.keys[idx] = k;
            this._delete(pred, k);
          } else if (succ.keys.length > minK) {
            let k = this.getSucc(succ);
            node.keys[idx] = k;
            this._delete(succ, k);
          } else {
            // Merge key + pred + succ
            pred.keys.push(node.keys[idx], ...succ.keys);
            pred.children.push(...succ.children);
            node.keys.splice(idx, 1);
            node.children.splice(idx + 1, 1);
            this._delete(pred, key);
          }
        }
      } else {
        // Case 2: Key not in this node
        if (node.leaf) return; // Key not found

        let child = node.children[idx];

        // Ensure child has enough keys before descending
        if (child.keys.length === minK) {
          let left = idx > 0 ? node.children[idx - 1] : null;
          let right = idx < node.children.length - 1 ? node.children[idx + 1] : null;

          if (left && left.keys.length > minK) {
            // Borrow from left
            child.keys.unshift(node.keys[idx - 1]);
            node.keys[idx - 1] = left.keys.pop();
            if (!left.leaf) child.children.unshift(left.children.pop());
          } else if (right && right.keys.length > minK) {
            // Borrow from right
            child.keys.push(node.keys[idx]);
            node.keys[idx] = right.keys.shift();
            if (!right.leaf) child.children.push(right.children.shift());
          } else if (left) {
            // Merge with left
            left.keys.push(node.keys[idx - 1], ...child.keys);
            left.children.push(...child.children);
            node.keys.splice(idx - 1, 1);
            node.children.splice(idx, 1);
            child = left;
          } else if (right) {
            // Merge with right
            child.keys.push(node.keys[idx], ...right.keys);
            child.children.push(...right.children);
            node.keys.splice(idx, 1);
            node.children.splice(idx + 1, 1);
          }
        }

        this._delete(child, key);
      }
    }

    getPred(node) {
      while (!node.leaf) node = node.children[node.children.length - 1];
      return node.keys[node.keys.length - 1];
    }

    getSucc(node) {
      while (!node.leaf) node = node.children[0];
      return node.keys[0];
    }
    // ---------- FIXED DELETE END ----------

    traverse() {
      const arr = [];
      function rec(n) {
        arr.push(n);
        n.children.forEach(c => rec(c));
      }
      rec(this.root);
      return arr;
    }
  }

  let tree = new BTree(parseInt(orderInput.value));

  function playSound(type) {
    const audio = new Audio();
    if (type === "insert") audio.src = "insert.wav";
    else if (type === "split") audio.src = "split.wav";
    else if (type === "delete") audio.src = "delete.wav";
    audio.volume = 0.2;
    audio.play();
  }

  function updateStats() {
    nodeCountEl.textContent = tree.traverse().length;
    function height(n) {
      if (n.leaf) return 1;
      return 1 + height(n.children[0]);
    }
    heightCountEl.textContent = height(tree.root);
  }

  function layout() {
    const levelGap = 90, nodeWBase = 70;
    function computeWidth(node) {
      if (node.leaf) node.subtreeWidth = Math.max(node.keys.length*30+20,nodeWBase);
      else {
        node.children.forEach(computeWidth);
        node.subtreeWidth = node.children.reduce((sum,c)=>sum+c.subtreeWidth,0)+(node.children.length-1)*40;
        node.subtreeWidth = Math.max(node.subtreeWidth,node.keys.length*30+20,nodeWBase);
      }
    }
    computeWidth(tree.root);

    function setPos(node,left,depth){
      node.targetY=60+depth*levelGap;
      if(node.leaf) node.targetX=left+node.subtreeWidth/2;
      else {
        let currX=left;
        node.children.forEach(c=>{ setPos(c,currX,depth+1); currX+=c.subtreeWidth+40; });
        node.targetX=(node.children[0].targetX+node.children[node.children.length-1].targetX)/2;
      }
    }
    setPos(tree.root,40,0);
  }

  function animateNodes() {
    let changed = false;
    tree.traverse().forEach(node=>{
      const dx=(node.targetX-node.x)*0.2, dy=(node.targetY-node.y)*0.2;
      if(Math.abs(dx)>0.5 || Math.abs(dy)>0.5) changed=true;
      node.x+=dx; node.y+=dy;
    });
    drawNodes();
    if(changed) requestAnimationFrame(animateNodes);
  }

  function roundRect(ctx,x,y,w,h,r){
    if(w<2*r) r=w/2; if(h<2*r) r=h/2;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+r,y,r);
    ctx.closePath();
  }

  function drawNodes(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    tree.traverse().forEach(drawNodeWithLinks);
    updateStats();
  }

  function drawNodeWithLinks(node){
    node.children.forEach(c=>{
      ctx.beginPath();
      ctx.moveTo(node.x,node.y+22);
      ctx.lineTo(c.x,c.y-22);
      ctx.strokeStyle=document.body.classList.contains("light-mode")?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)";
      ctx.lineWidth=2;
      ctx.stroke();
      drawNodeWithLinks(c);
    });
    const boxW = Math.max(50+node.keys.length*30,70), boxH=40;
    ctx.beginPath();
    roundRect(ctx,node.x-boxW/2,node.y-boxH/2,boxW,boxH,12);
    ctx.fillStyle=layerColors[Math.floor(Math.log2(tree.traverse().indexOf(node)+1))%layerColors.length];
    ctx.fill();
    ctx.lineWidth=2;
    ctx.strokeStyle=document.body.classList.contains("light-mode")?"#000":"rgba(255,255,255,0.95)";
    ctx.stroke();
    ctx.font="14px Poppins";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    const startX=node.x-boxW/2+12;
    node.keys.forEach((k,i)=>{
      const keyX=startX+i*30+18;
      roundRect(ctx,keyX-14,node.y-12,28,24,8);
      ctx.fillStyle="rgba(0,0,0,0.05)";
      ctx.fill();
      ctx.fillStyle=document.body.classList.contains("light-mode")?"#000":"#fff";
      ctx.fillText(k,keyX,node.y);
    });
  }

  function redrawTree() { layout(); animateNodes(); }

  insertBtn.addEventListener("click",()=>{
    const val=parseInt(keyInput.value);
    if(!isNaN(val)){ tree.insert(val); keyInput.value=""; redrawTree(); }
  });

  deleteBtn.addEventListener("click",()=>{
    const val=parseInt(keyInput.value);
    if(!isNaN(val)){ tree.delete(val); keyInput.value=""; redrawTree(); }
  });

  clearBtn.addEventListener("click",()=>{
    tree=new BTree(parseInt(orderInput.value)); redrawTree();
  });

  orderInput.addEventListener("change",()=>{
    tree=new BTree(parseInt(orderInput.value)); redrawTree();
  });

  drawNodes();
});
