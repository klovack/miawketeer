import { FaGithub, FaLinkedin, FaX } from "react-icons/fa6";
import { useGameManagerStore } from "../../../Store/GameManagerStore/GameManagerStore";
import "./DeathUI.scss";
import { useEffect, useState } from "react";
import { BsMailbox2Flag } from "react-icons/bs";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { IconBaseProps } from "react-icons";

type SocialMediaLink = {
  name: string;
  url: string;
  type: string;
};

const SocialMediaType: {
  [key: string]: (props: IconBaseProps) => JSX.Element;
} = {
  X: (props) => <FaX {...props} />,
  GITHUB: (props) => <FaGithub {...props} />,
  LINKED_IN: (props) => <FaLinkedin {...props} />,
  MAIL: (props) => <BsMailbox2Flag {...props} />,
  PORTFOLIO: (props) => <BiSolidCoffeeBean {...props} />,
};

export default function DeathUI() {
  const { isDead, newGame, points, highscore } = useGameManagerStore(
    (state) => ({
      isDead: state.isPlayerDead,
      newGame: state.newGame,
      points: state.points,
      highscore: state.highscore,
    })
  );
  const [socials, setSocials] = useState<SocialMediaLink[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      const res = await fetch("/resources/socials.json");
      const data: SocialMediaLink[] = await res.json();

      if (data) {
        setSocials(data);
      }
    };

    fetchSocials();
  }, []);

  return (
    <>
      {isDead() && (
        <div className="death-ui">
          <h1 className="death-ui__text">YOU DIED</h1>
          <div className="death-ui__scores">
            <h3 className="death-ui__scores__point">score: {points}</h3>
            <h3 className="death-ui__scores__high">highscore: {highscore}</h3>
          </div>
          <button className="death-ui__button" onClick={newGame}>
            TRY AGAIN
          </button>

          <div className="death-ui__social">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={`death-ui__social__icon soc-${social.type}`}
              >
                {SocialMediaType[social.type]({
                  size: 20,
                })}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
