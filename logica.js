<script>
        // Mapeamento dos elementos do DOM
        const telaInicio = document.getElementById("tela-inicio");
        const telaJogo = document.getElementById("tela-jogo");
        const telaResultado = document.getElementById("tela-resultado");
        
        const btnIniciar = document.getElementById("btn-iniciar");
        const dialogoViajante = document.getElementById("dialogo-viajante");
        const opcoesContainer = document.getElementById("opcoes-container");
        const audioPlayer = document.getElementById("audio-player");
        
        // Novos elementos para o resultado e o efeito Fade-In
        const textoResultado = document.getElementById("texto-resultado");
        const imagemResultado = document.getElementById("imagem-resultado");
        const resultadoConteudo = document.getElementById("resultado-conteudo"); // 🚨 NOVO

        let pontuacao = 0;
        let perguntaAtual = 0;

        // --------------------------------------------------------
        // DEFINIÇÃO DAS PERGUNTAS E OPÇÕES
        // --------------------------------------------------------
        const questoes = [
            {
                dialogo: "Viajante, a primeira decisão: você se depara com um vazamento na rua. O que você faz?",
                audio: "audio/audio_1_vazamento.mp3",
                opcoes: [
                    { texto: "Ignora e pensa que é problema da prefeitura.", pontos: 0 },
                    { texto: "Tenta consertar você mesmo, sem as ferramentas certas.", pontos: 10 },
                    { texto: "Liga imediatamente para a companhia de saneamento para relatar.", pontos: 20 }
                ]
            },
            {
                dialogo: "Ao escovar os dentes, você mantém a torneira aberta. Isso é um erro fatal no futuro. Qual é o seu hábito correto?",
                audio: "audio/audio_2_torneira.mp3",
                opcoes: [
                    { texto: "Abre a torneira só para enxaguar a boca.", pontos: 20 },
                    { texto: "Deixa a torneira aberta, mas usa um copo para enxaguar.", pontos: 10 },
                    { texto: "Deixa a torneira aberta o tempo todo.", pontos: 0 }
                ]
            },
            {
                dialogo: "Você vai lavar o carro. Qual método você escolhe para economizar mais água?",
                audio: "audio/audio_3_lavar_carro.mp3",
                opcoes: [
                    { texto: "Usa a mangueira, pois é mais rápido e eficiente.", pontos: 0 },
                    { texto: "Usa balde e pano para ensaboar e enxaguar.", pontos: 20 },
                    { texto: "Leva o carro para um lava-rápido que utiliza água de reuso.", pontos: 10 }
                ]
            },
            {
                dialogo: "Na hora de tomar banho, qual é a atitude mais sustentável que você adota?",
                audio: "audio/audio_4_banho.mp3",
                opcoes: [
                    { texto: "Canta três músicas no chuveiro e se ensaboa com ele aberto.", pontos: 0 },
                    { texto: "Se ensaboa com o chuveiro fechado e toma um banho de 10 minutos.", pontos: 10 },
                    { texto: "Se ensaboa com o chuveiro fechado e toma um banho rápido de 5 minutos.", pontos: 20 }
                ]
            },
            {
                dialogo: "Para limpar a calçada, você tem estas opções. Qual a melhor para economizar?",
                audio: "audio/audio_5_limpar_calçada.mp3",
                opcoes: [
                    { texto: "Usa a mangueira para varrer a sujeira.", pontos: 0 },
                    { texto: "Usa vassoura e depois joga um balde de água.", pontos: 10 },
                    { texto: "Usa apenas a vassoura.", pontos: 20 }
                ]
            }
        ];

        // --------------------------------------------------------
        // FUNÇÕES DE ÁUDIO
        // --------------------------------------------------------

        /**
         * Toca um arquivo de áudio e executa um callback ao terminar.
         * @param {string} src - O caminho para o arquivo de áudio.
         * @param {function} callback - Função a ser executada quando o áudio terminar.
         */
        function tocarAudio(src, callback) {
            audioPlayer.src = src;
            audioPlayer.onended = callback || null; // Garante que é null se não houver callback
            audioPlayer.play().catch(e => console.log("Erro ao tentar tocar áudio: ", e));
        }

        // --------------------------------------------------------
        // FUNÇÕES DE EXIBIÇÃO E LÓGICA DO JOGO
        // --------------------------------------------------------

        /**
         * Inicia a tela de jogo.
         */
        function iniciarJogo() {
            telaInicio.classList.remove("ativa");
            telaJogo.classList.add("ativa");
            pontuacao = 0;
            perguntaAtual = 0;
            carregarPergunta();
        }

        /**
         * Carrega e exibe a pergunta atual.
         */
        function carregarPergunta() {
            if (perguntaAtual >= questoes.length) {
                // Fim do jogo, mostra o resultado
                mostrarResultado();
                return;
            }

            const questao = questoes[perguntaAtual];
            dialogoViajante.textContent = questao.dialogo;
            opcoesContainer.innerHTML = ''; // Limpa as opções anteriores

            // Toca o áudio da pergunta
            tocarAudio(questao.audio);

            // Cria os botões de opção
            questao.opcoes.forEach(opcao => {
                const btn = document.createElement("button");
                btn.classList.add("opcao-botao");
                btn.textContent = opcao.texto;
                btn.onclick = () => responderPergunta(opcao.pontos);
                opcoesContainer.appendChild(btn);
            });
        }

        /**
         * Processa a resposta do usuário, soma a pontuação e carrega a próxima pergunta.
         * @param {number} pontos - Os pontos ganhos com a opção escolhida.
         */
        function responderPergunta(pontos) {
            // Pausa qualquer áudio de pergunta que esteja tocando
            audioPlayer.pause(); 
            audioPlayer.currentTime = 0;

            pontuacao += pontos;
            perguntaAtual++;
            
            // Um pequeno delay para dar tempo de carregar o áudio e a próxima tela
            setTimeout(carregarPergunta, 500);
        }
        
        /**
         * Mostra a tela de resultado final com o efeito de transição "Abrindo os Olhos".
         */
        function mostrarResultado() {
            let resultado = "";
            let imagemFinal = "";
            let audioFinal = "";
            const pontuacaoFinal = ` (Pontuação: ${pontuacao})`;

            // 1. Pausa o áudio anterior (garantindo que o portal pare)
            audioPlayer.pause(); 
            audioPlayer.currentTime = 0;
            
            // 2. Garante que o conteúdo de resultado COMECE invisível (opacidade 0)
            resultadoConteudo.classList.remove('fade-in'); 
            resultadoConteudo.classList.add('fade-out');

            // 3. Toca o áudio da travessia
            tocarAudio("audio/audio_14_travessia.mp3", function() {
                // 4. Callback 1: após o áudio da travessia, mostra a tela e calcula o resultado
                
                // CÁLCULO DO RESULTADO (seu código existente)
                if (pontuacao >= 80) {
                    resultado = `🌳 Futuro Éden (Próspero)\nIncrível! Suas escolhas criaram um Futuro Próspero. A água flui livre, os rios estão cheios e a vida prospera. Obrigado por nos guiar para este Éden, Viajante.${pontuacaoFinal}`;
                    imagemFinal = "imagens/eden/eden_1.jpg";
                    audioFinal = "audio/audio_final_eden.mp3";
                } else if (pontuacao >= 50) {
                    resultado = `🌿 Futuro em Recuperação\nO cenário é de Recuperação! A natureza começa a se reerguer, mas o planeta ainda enfrenta desafios. Continue com hábitos sustentáveis para garantir a vitória no amanhã!${pontuacaoFinal}`;
                    imagemFinal = "imagens/recuperacao/recuperacao_1.jpg";
                    audioFinal = "audio/audio_final_recuperacao.mp3";
                } else if (pontuacao >= 20) {
                    resultado = `☁ Futuro no Limiar\nAtenção! Estamos no Limiar do Possível. Há esperança, mas o tempo está acabando. Temos pouco tempo para mudar o curso final.${pontuacaoFinal}`;
                    imagemFinal = "imagens/limiar/limiar_1.jpg";
                    audioFinal = "audio/audio_final_limiar.mp3";
                } else if (pontuacao >= 0) {
                    resultado = `🔥 Futuro em Alerta\nALERTA VERMELHO! O futuro está em Crise. A escassez de água e o calor são graves. É urgente mudar TUDO hoje, ou o pior cenário se concretizará!${pontuacaoFinal}`;
                    imagemFinal = "imagens/alerta/alerta_1.jpg";
                    audioFinal = "audio/audio_final_alerta.mp3";
                } else {
                    resultado = `💀 Futuro Distopia\nO futuro que você viu é uma Distopia! O desperdício e a falta de ação trouxeram a escassez total. Volte ao presente e mude TUDO, ou o mundo secará!${pontuacaoFinal}`;
                    imagemFinal = "imagens/distopia/distopia_1.jpg";
                    audioFinal = "audio/audio_final_distopia.mp3";
                }

                telaJogo.classList.remove("ativa");
                telaResultado.classList.add("ativa");
                
                textoResultado.textContent = resultado;
                imagemResultado.src = imagemFinal;
                
                // 5. Toca o áudio final do resultado. É aqui que o viajante fala para "abrir os olhos"!
                tocarAudio(audioFinal, function() {
                    // 6. Callback 2: Quando o áudio final terminar, 
                    // REMOVE A CLASSE FADE-OUT e ADICIONA FADE-IN
                    // O efeito de 3s do CSS entra em ação, simulando a abertura dos olhos.
                    resultadoConteudo.classList.remove('fade-out');
                    resultadoConteudo.classList.add('fade-in'); 
                });
            });
        }


        /**
         * Reinicia o jogo.
         */
        function recomecarJogo() {
            telaResultado.classList.remove("ativa");
            telaInicio.classList.add("ativa");
            pontuacao = 0;
            perguntaAtual = 0;
            
            // 🚨 NOVO: Garante que o conteúdo de resultado é resetado para invisível para o próximo ciclo
            if (resultadoConteudo) {
                resultadoConteudo.classList.remove('fade-in');
                resultadoConteudo.classList.add('fade-out');
            }
        }

        // --------------------------------------------------------
        // EVENT LISTENERS
        // --------------------------------------------------------
        btnIniciar.addEventListener("click", iniciarJogo);
        document.getElementById("btn-recomecar").addEventListener("click", recomecarJogo);

        // --------------------------------------------------------
        // INICIALIZAÇÃO
        // --------------------------------------------------------
        document.addEventListener('DOMContentLoaded', () => {
             // Garante que o conteúdo de resultado começa invisível
            if (resultadoConteudo) {
                resultadoConteudo.classList.add('fade-out');
            }
            // Inicia o áudio na tela inicial para evitar problemas de autoplay em alguns navegadores
            // tocarAudio("audio/audio_inicial.mp3"); 
        });

    </script>