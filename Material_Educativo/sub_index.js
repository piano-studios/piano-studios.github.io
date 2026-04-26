function cambiarPDF(ruta) {
    document.getElementById('visor').src = ruta;
}


function downloadPDF() {
    const embed = document.getElementById('visor');
    const src = embed.src;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = src;
    
    // Extract the filename from the path (e.g., "Himno_de_la_Alegria.pdf")
    const filename = src.split('/').pop();
    link.download = filename;
    
    // Trigger the download
    link.click();
}

function openPDF() {
    const embed = document.getElementById('visor');
    const src = embed.src;
    window.open(src, '_blank');
}

// Attach event listener to the download button
document.getElementById('download').addEventListener('click', downloadPDF);
document.getElementById('open').addEventListener('click', openPDF);




function toggleNeuma(){
    let elemento_n1 = document.getElementById("li_neuma1");
      if (elemento_n1.style.display === "none") {
        elemento_n1.style.display = "block"; 
      } else {
        elemento_n1.style.display = "none"; 
      }

    let elemento_n2 = document.getElementById("li_neuma2");
      if (elemento_n2.style.display === "none") {
        elemento_n2.style.display = "block"; 
      } else {
        elemento_n2.style.display = "none"; 
      }

    let elemento_n3 = document.getElementById("li_neuma3");
      if (elemento_n3.style.display === "none") {
        elemento_n3.style.display = "block"; 
      } else {
        elemento_n3.style.display = "none"; 
      }
}

function toggleUni(){
    let elemento_u1 = document.getElementById("li_uni1");
      if (elemento_u1.style.display === "none") {
        elemento_u1.style.display = "block"; 
      } else {
        elemento_u1.style.display = "none"; 
      }

    let elemento_u2 = document.getElementById("li_uni2");
      if (elemento_u2.style.display === "none") {
        elemento_u2.style.display = "block"; 
      } else {
        elemento_u2.style.display = "none"; 
      }

    let elemento_u3 = document.getElementById("li_uni3");
      if (elemento_u3.style.display === "none") {
        elemento_u3.style.display = "block"; 
      } else {
        elemento_u3.style.display = "none"; 
      }
}

function togglePenta(){
    let elemento_p1 = document.getElementById("li_penta1");
      if (elemento_p1.style.display === "none") {
        elemento_p1.style.display = "block"; 
      } else {
        elemento_p1.style.display = "none"; 
      }

    let elemento_p2 = document.getElementById("li_penta2");
      if (elemento_p2.style.display === "none") {
        elemento_p2.style.display = "block"; 
      } else {
        elemento_p2.style.display = "none"; 
      }

    let elemento_p3 = document.getElementById("li_penta3");
      if (elemento_p3.style.display === "none") {
        elemento_p3.style.display = "block"; 
      } else {
        elemento_p3.style.display = "none"; 
      }

    let elemento_p4 = document.getElementById("li_penta4");
      if (elemento_p4.style.display === "none") {
        elemento_p4.style.display = "block"; 
      } else {
        elemento_p4.style.display = "none"; 
      }
    
    let elemento_p5 = document.getElementById("li_penta5");
      if (elemento_p5.style.display === "none") {
        elemento_p5.style.display = "block"; 
      } else {
        elemento_p5.style.display = "none"; 
      }
}
