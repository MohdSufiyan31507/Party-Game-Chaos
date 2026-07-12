import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Panel } from "../components/ui/Panel";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchRecentRooms,
  fetchStats,
  fetchStore,
  purchaseStoreItem,
  type RecentRoom,
  type StoreItem,
} from "../services/userService";
import { PageScaffold } from "./PageScaffold";

export function ProfilePage() {
  const { token, user } = useAuth();
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const initial = user?.username?.slice(0, 1).toUpperCase() ?? "C";

  useEffect(() => {
    if (!token) return;
    fetchRecentRooms(token).then((response) => setRecentRooms(response.rooms)).catch(() => {});
  }, [token]);

  return (
    <PageScaffold title="Player Profile" eyebrow="Legend Card">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Panel>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid size-24 place-items-center rounded-lg border border-surge/40 bg-surge/15 text-4xl font-black text-surge">
              {initial}
            </div>
            <div>
              <h2 className="text-3xl font-black">{user?.username ?? "Chaos Player"}</h2>
              <p className="mt-2 text-white/62">
                Level {user?.level ?? 1} | {user?.coins ?? 0} coins | {user?.wins ?? 0} wins
              </p>
              {user?.isGuest ? <p className="mt-2 text-sm font-bold text-flare">Guest profile</p> : null}
            </div>
          </div>
        </Panel>
        <Panel>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-surge">Recent Games</p>
          <div className="mt-4 space-y-3">
            {recentRooms.length ? (
              recentRooms.map((room) => (
                <div key={room._id} className="rounded-lg border border-white/10 p-3">
                  <p className="font-black">{room.name}</p>
                  <p className="mt-1 text-sm text-white/58">
                    {room.finalResult?.winnerTeamName ?? "Winner"} won | {room.finalResult?.scores.red ?? 0}-
                    {room.finalResult?.scores.blue ?? 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/58">Finished games will show up here.</p>
            )}
          </div>
        </Panel>
      </div>
    </PageScaffold>
  );
}

export function AchievementsPage() {
  const { user } = useAuth();
  const achievements = user?.achievements.length ? user.achievements : ["First Login"];

  return (
    <PageScaffold title="Badge Shelf" eyebrow="Achievements">
      <div className="grid gap-4 sm:grid-cols-3">
        {achievements.map((achievement) => (
          <Panel key={achievement}>
            <p className="text-xl font-black">{achievement}</p>
            <p className="mt-3 text-sm text-white/58">Unlocked from real profile progress.</p>
          </Panel>
        ))}
      </div>
    </PageScaffold>
  );
}

export function StatisticsPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    gamesPlayed: user?.gamesPlayed ?? 0,
    wins: user?.wins ?? 0,
    losses: user?.losses ?? 0,
    totalScore: user?.totalScore ?? 0,
    winRate: user?.gamesPlayed ? Math.round((user.wins / user.gamesPlayed) * 100) : 0,
    xp: user?.xp ?? 0,
  });

  useEffect(() => {
    if (!token) return;
    fetchStats(token).then((response) => setStats(response.stats)).catch(() => {});
  }, [token]);

  return (
    <PageScaffold title="Battle Stats" eyebrow="Statistics">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Games Played", String(stats.gamesPlayed)],
          ["Wins", String(stats.wins)],
          ["Losses", String(stats.losses)],
          ["Win Rate", `${stats.winRate}%`],
          ["Total Score", String(stats.totalScore)],
          ["XP", String(stats.xp)],
        ].map(([label, value]) => (
          <Panel key={label}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/42">{label}</p>
            <p className="mt-2 text-4xl font-black">{value}</p>
          </Panel>
        ))}
      </div>
    </PageScaffold>
  );
}

export function StorePage() {
  const { setUserFromApi, token, user } = useAuth();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchStore(token).then((response) => setItems(response.items)).catch(() => {});
  }, [token]);

  async function handlePurchase(itemId: string) {
    if (!token) return;
    setMessage("");

    try {
      const response = await purchaseStoreItem(token, itemId);
      setUserFromApi(response.user);
      setMessage(response.alreadyOwned ? "Already owned." : `${response.item.name} unlocked.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Purchase failed");
    }
  }

  return (
    <PageScaffold title="Chaos Shop" eyebrow={`${user?.coins ?? 0} coins`}>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const owned = user?.purchases.includes(item.id);
          return (
            <Panel key={item.id}>
              <p className="text-xl font-black">{item.name}</p>
              <p className="mt-3 text-sm text-white/58">{item.cost} coins</p>
              <Button
                type="button"
                tone={owned ? "green" : "orange"}
                className="mt-5 w-full"
                disabled={owned || (user?.coins ?? 0) < item.cost}
                onClick={() => handlePurchase(item.id)}
              >
                {owned ? "Owned" : "Unlock"}
              </Button>
            </Panel>
          );
        })}
      </div>
      {message ? <p className="mt-4 text-sm font-bold text-flare">{message}</p> : null}
    </PageScaffold>
  );
}

export function SettingsPage() {
  return (
    <PageScaffold title="Control Room" eyebrow="Settings">
      <Panel>
        <div className="space-y-4">
          {["Narrator messages", "Motion effects", "Sound cues"].map((setting) => (
            <label key={setting} className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <span className="font-bold">{setting}</span>
              <input type="checkbox" defaultChecked className="size-5 accent-cyan-400" />
            </label>
          ))}
        </div>
      </Panel>
    </PageScaffold>
  );
}

export function AboutPage() {
  return (
    <PageScaffold title="About the Adda" eyebrow="About">
      <Panel>
        <p className="max-w-3xl text-lg leading-8 text-white/68">
          Chaos Ka Adda is a dark-neon multiplayer party game platform with local narrator lines,
          no external AI APIs, MongoDB-backed auth, rooms, realtime play, and persistent player
          progress. The purple genie is the official mascot of the game, dealing chaos cards and
          carrying the Adda's party energy across the experience.
        </p>
      </Panel>
    </PageScaffold>
  );
}

export function NotFoundPage() {
  return (
    <main className="dark-stage grid min-h-screen place-items-center bg-[#070817] px-4 text-center text-white">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-punch">404</p>
        <h1 className="mt-4 text-5xl font-black">Wrong room code.</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/62">This route left the lobby before readying up.</p>
        <Button to="/home" icon={Home} tone="cyan" className="mt-8">
          Back Home
        </Button>
      </section>
    </main>
  );
}
