/* src/components/Chatbot/Chatbot.jsx */
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour ! Je suis votre assistant AI. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulation de l'intégration Gemini
    // Dans une version réelle, vous appelleriez ici votre service Gemini
    try {
      // Simulate API delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: getMockResponse(inputValue),
          sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Erreur Gemini:", error);
      setIsTyping(false);
    }
  };

  const getMockResponse = (input) => {
    const text = input.toLowerCase();

    if (text.includes("reservation") || text.includes("réserver") || text.includes("comment faire")) {
      return "Pour faire une réservation, suivez ces étapes simple :\n1. Connectez-vous à votre compte.\n2. Allez dans la section 'Trajets'.\n3. Choisissez votre itinéraire et cliquez sur 'Réserver'.\n4. Sélectionnez votre siège et procédez au paiement. Besoin d'aide pour une étape précise ?";
    }

    if (text.includes("difficulté") || text.includes("problème") || text.includes("marche pas") || text.includes("erreur")) {
      return "Je suis désolé que vous rencontriez des difficultés. Voici les solutions aux problèmes fréquents :\n- Problème de connexion : Vérifiez vos identifiants ou réinitialisez votre mot de passe.\n- Paiement échoué : Assurez-vous que votre carte est activée pour les paiements en ligne.\n- Bug d'affichage : Essayez de rafraîchir la page ou de vider le cache de votre navigateur.\nSi le problème persiste, contactez notre support technique.";
    }

    if (text.includes("prix") || text.includes("tarif")) {
      return "Nos tarifs sont calculés en fonction de la distance et du type de véhicule. Vous verrez le prix exact lors de la sélection de votre trajet avant de confirmer la réservation.";
    }

    if (text.includes("contact") || text.includes("aide")) {
      return "Vous pouvez nous joindre par téléphone au +225 05 94 21 29 05 ou par email à support@atelier.com. Je suis également là pour répondre à vos questions rapides !";
    }

    return "C'est une excellente question ! En tant qu'assistant AI, je peux vous guider pour vos réservations, vos trajets ou résoudre vos problèmes techniques. Que souhaitez-vous savoir de plus ?";
  };

  return (
    <>
      {/* Bouton Bulle */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" /></svg>
        )}
      </button>

      {/* Fenêtre de Chat */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">AI</div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Assistant Atelier</div>
              <div className="chatbot-status">En ligne</div>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>&times;</button>
        </div>

        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Écrivez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="chatbot-send" onClick={handleSend}>
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
