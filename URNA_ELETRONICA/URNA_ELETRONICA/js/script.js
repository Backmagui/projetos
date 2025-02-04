let seuVotoPara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');

let etapaAtual = 0;
let numero = '';
let votos = [];
let votoBranco = false;

function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let numeroHTML = '';
    numero = '';
    votoBranco = false;


    for(let i=0;i<etapa.numeros;i++) {
        if(i ===0) {
            numeroHTML += '<div class="numero pisca"></div>';
        } else{
            numeroHTML += '<div class="numero"></div>';
        }    
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHTML;
}

function atualizaInterface(){
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item)=>{
        if(item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });
    if(candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = 'Nome: '+candidato.nome+'<br/>'+'Partido: '+candidato.partido;

        let fotosHTML = '';
        for(let i in candidato.fotos){
            if(candidato.fotos[i].small) {
                fotosHTML += '<div class="d-1-image small"> <img src="Images/'+candidato.fotos[i].url+'" alt="" /></div>';
            }else {
                fotosHTML += '<div class="d-1-image"> <img src="Images/'+candidato.fotos[i].url+'" alt="" /></div>';
            }
        }

        lateral.innerHTML = fotosHTML;
    }else {
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
    }
}

function clicou(n) {
    let somNumeros = new Audio();
    somNumeros.src = "audios/numeros.mp3";
    somNumeros.play();

    let elNumero = document.querySelector('.numero.pisca');
    if(elNumero !== null) {
        elNumero.innerHTML = n;
        numero = numero+n;

        elNumero.classList.remove('pisca');
        if( elNumero.nextElementSibling !== null){
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
} 

function voltar() {
    corrige(); // Chama a função corrige() quando o voto for em branco
}


function corrige() {
    let somCorrige = new Audio();
    somCorrige.src = "audios/corrige.mp3";
    somCorrige.play();
    comecarEtapa();
}

function imprimirResultado() {
    let resultado = 'Resultado da votação:\n\n';
    for (let i = 0; i < etapas.length; i++) {
        resultado += 'Etapa: ' + etapas[i].titulo + '\n';
        let candidatos = etapas[i].candidatos;
        let votosValidos = votos.filter((voto) => voto.etapa === etapas[i].titulo && candidatos.some((candidato) => candidato.numero === voto.voto));
        //let votosNulos = votos.filter((voto) => voto.etapa === etapas[i].titulo && !candidatos.some((candidato) => candidato.numero === voto.voto)).length;
        for (let j = 0; j < candidatos.length; j++) {
            let totalVotos = votosValidos.filter((voto) => voto.voto === candidatos[j].numero).length;
            resultado += 'Candidato: ' + candidatos[j].nome + ', Votos: ' + totalVotos + '\n';
        }
        //resultado += 'Votos Nulos: ' + votosNulos + '\n\n';
    }

    let blob = new Blob([resultado], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'resultado_votacao.txt';
    a.click();
    URL.revokeObjectURL(url);
}


function confirma() {
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false;
    let somConfirma = new Audio("audios/confirma.mp3");

    if(votoBranco === true) {
        votoConfirmado = true;
        somConfirma.play();

        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if(numero.length === etapa.numeros) {
        let candidatoValido = etapa.candidatos.find(candidato => candidato.numero === numero);
        if (candidatoValido) {
            votoConfirmado = true;
            somConfirma.play();

            votos.push({
                etapa: etapas[etapaAtual].titulo,
                voto: numero
            });
        } else {
            alert('Número de candidato inválido. Por favor, insira um número válido');
        }
    }

    if(votoConfirmado) {
        // Exibe o alerta antes de prosseguir
        alert('Obrigado pelo seu voto');

        etapaAtual++;
        if(etapas[etapaAtual] !== undefined) {
            // Aguarda 2 segundos antes de ir para a próxima etapa
            setTimeout(comecarEtapa, 2000);
        } else {
            if (votos.length === 32) {
                imprimirResultado();
                document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
            } else {
                etapaAtual = 0;
                comecarEtapa();
            }
            console.log(votos);
        }
    }
}


comecarEtapa();
