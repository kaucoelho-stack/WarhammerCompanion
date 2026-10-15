/* Availability is a product choice, not a certification of official rules. */
(()=>{const available=new Set(['aod','kom']);window.AuspexTeamAvailability={isAvailable:id=>available.has(id),label:id=>available.has(id)?'Disponível':'Em breve',reason:()=> 'Este time ainda não está disponível. Escolha Angels of Death ou Kommandos.'};})();
