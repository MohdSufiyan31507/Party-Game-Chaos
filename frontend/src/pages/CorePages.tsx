import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Home,
  LogOut,
  PlusCircle,
  Shuffle,
  SkipForward,
  UsersRound,
  Trophy,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Panel } from "../components/ui/Panel";
import { StatusNote } from "../components/ui/StatusNote";
import { useAuth } from "../contexts/AuthContext";
import { useRoom } from "../contexts/RoomContext";
import { homeActions } from "../data/navigation";
import { GamePlayer } from "../features/games/components/GamePlayer";
import { gameCategories } from "../features/games/metadata/gameMetadata";
import { gameRegistry, getGameById, getPlayableGames } from "../features/games/registry";
import { fetchLeaderboard, type LeaderboardPlayer } from "../services/userService";
import { PageScaffold } from "./PageScaffold";

function formValue(form: HTMLFormElement, name: string) {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function HomeDashboardPage() {
  return (
    <PageScaffold title="Tonight's Chaos HQ" eyebrow="Home Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {homeActions.map(({ label, href, icon, tone }) => (
          <Button key={href} to={href} icon={icon} tone={tone} className="h-24">
            {label}
          </Button>
        ))}
      </div>
    </PageScaffold>
  );
}

export function CreateRoomPage() {
  const navigate = useNavigate();
  const { createRoom, isRoomLoading } = useRoom();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const room = await createRoom({
        name: formValue(event.currentTarget, "name") || "Friday Chaos",
        maxPlayers: Number(formValue(event.currentTarget, "maxPlayers") || 8),
      });
      navigate(`/lobby/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create room");
    }
  }

  return (
    <PageScaffold title="Host a Party" eyebrow="Room Builder">
      <Panel>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <Field label="Room Name" name="name" placeholder="Friday Chaos" />
          <Field
            label="Max Players"
            name="maxPlayers"
            type="number"
            min={2}
            max={16}
            defaultValue={8}
          />
          {error ? <p className="text-sm font-bold text-punch md:col-span-2">{error}</p> : null}
          <Button
            icon={PlusCircle}
            tone="pink"
            className="md:col-span-2"
            disabled={isRoomLoading}
          >
            {isRoomLoading ? "Creating Room" : "Create Room"}
          </Button>
        </form>
      </Panel>
    </PageScaffold>
  );
}

export function JoinRoomPage() {
  const navigate = useNavigate();
  const { joinRoom, isRoomLoading } = useRoom();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const room = await joinRoom({ code: formValue(event.currentTarget, "code") });
      navigate(`/lobby/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join room");
    }
  }

  return (
    <PageScaffold title="Join the Chaos" eyebrow="Room Code">
      <Panel>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Room Code" name="code" placeholder="CHAOS7" required />
          {error ? <p className="text-sm font-bold text-punch">{error}</p> : null}
          <Button tone="orange" className="w-full" disabled={isRoomLoading}>
            {isRoomLoading ? "Joining" : "Join Lobby"}
          </Button>
        </form>
      </Panel>
    </PageScaffold>
  );
}

function namesFromTextarea(value: string) {
  return value
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function LocalTeamSetupPage() {
  const navigate = useNavigate();
  const { createRoom, isRoomLoading, setupLocalTeams } = useRoom();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const redMembers = namesFromTextarea(formValue(form, "redMembers"));
    const blueMembers = namesFromTextarea(formValue(form, "blueMembers"));

    if (!redMembers.length || !blueMembers.length) {
      setError("Add at least one member to each team.");
      return;
    }

    try {
      const room = await createRoom({
        name: formValue(form, "roomName") || "One Device Adda",
        maxPlayers: 2,
      });
      await setupLocalTeams(room.code, {
        redTeamName: formValue(form, "redTeamName") || "Red Team",
        blueTeamName: formValue(form, "blueTeamName") || "Blue Team",
        redMembers,
        blueMembers,
      });
      navigate("/games");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create local teams");
    }
  }

  return (
    <PageScaffold
      title="Create Local Teams"
      eyebrow="One Device Mode"
      subtitle="The person creating this setup is the host. Add team names and members, then pass the device around."
    >
      <Panel>
        <StatusNote tone="info">
          One device mode creates a private room for the host only. Add the real player names here, then choose a game and pass the phone around.
        </StatusNote>
        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div className="lg:col-span-2">
            <Field label="Room Name" name="roomName" placeholder="Friday Adda" />
          </div>
          <Field label="Team 1 Name" name="redTeamName" placeholder="Team Bawaal" defaultValue="Red Team" />
          <Field label="Team 2 Name" name="blueTeamName" placeholder="Team Dhamaka" defaultValue="Blue Team" />
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Team 1 Members
            </span>
            <textarea
              name="redMembers"
              required
              rows={6}
              placeholder={"Aditya\nLakshya\nUrmil\nSufiyan\nGayatri"}
              className="w-full rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-surge/70 focus:ring-4 focus:ring-surge/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Team 2 Members
            </span>
            <textarea
              name="blueMembers"
              required
              rows={6}
              placeholder={"Ayush\nTanmay\nGargi\nSagar"}
              className="w-full rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-surge/70 focus:ring-4 focus:ring-surge/10"
            />
          </label>
          <p className="text-sm font-bold leading-6 text-white/54 lg:col-span-2">
            Put each member on a new line, or separate names with commas. These names are for the scoreboard and team identity; only the host account is needed.
          </p>
          {error ? <p className="text-sm font-bold text-punch lg:col-span-2">{error}</p> : null}
          <Button
            icon={UsersRound}
            tone="cyan"
            className="lg:col-span-2"
            disabled={isRoomLoading}
          >
            {isRoomLoading ? "Creating Teams" : "Create Teams"}
          </Button>
        </form>
      </Panel>
    </PageScaffold>
  );
}

export function LobbyPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, leaveRoom, loadRoom, socketState, updateRoomStatus } = useRoom();
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy");

  useEffect(() => {
    if (!code) return;

    loadRoom(code).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load room");
    });
  }, [code, loadRoom]);

  const isHost = Boolean(activeRoom && user && activeRoom.host === user._id);

  async function handleCopy() {
    if (!activeRoom) return;

    await navigator.clipboard?.writeText(activeRoom.code);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy"), 1200);
  }

  async function handleStartSetup() {
    if (!activeRoom) return;

    try {
      await updateRoomStatus(activeRoom.code, "team-setup");
      navigate(`/teams/${activeRoom.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Only the host can start setup");
    }
  }

  async function handleLeaveRoom() {
    if (!activeRoom) return;

    try {
      await leaveRoom(activeRoom.code);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not leave room");
    }
  }

  if (isRoomLoading && !activeRoom) {
    return (
      <PageScaffold title="Loading Lobby" eyebrow="Room">
        <Panel>
          <StatusNote>Finding the room and checking the guest list...</StatusNote>
        </Panel>
      </PageScaffold>
    );
  }

  if (!activeRoom) {
    return (
      <PageScaffold title="No Lobby Loaded" eyebrow="Room">
        <Panel>
          <StatusNote tone={error ? "warn" : "info"}>
            {error || "Create or join a room first."}
          </StatusNote>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/rooms/create" icon={PlusCircle} tone="pink">
              Create Room
            </Button>
            <Button to="/rooms/join" tone="orange">
              Join Room
            </Button>
          </div>
        </Panel>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold title={activeRoom.name} eyebrow={`Room ${activeRoom.code}`}>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Panel>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-surge">
            Invite Code
          </p>
          <p className="mt-2 text-4xl font-black">{activeRoom.code}</p>
          <p className="mt-3 text-sm text-white/58">
            {activeRoom.players.length}/{activeRoom.maxPlayers} players joined | Status:{" "}
            {activeRoom.status}
          </p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-lime">
            Realtime: {socketState}
          </p>
          <Button icon={Copy} tone="ghost" type="button" className="mt-5" onClick={handleCopy}>
            {copyLabel}
          </Button>
          <Button
            icon={LogOut}
            tone="ghost"
            type="button"
            className="ml-0 mt-3 sm:ml-3"
            disabled={isRoomLoading}
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
          {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
        </Panel>

        <Panel>
          <StatusNote tone={isHost ? "success" : "info"}>
            {isHost
              ? "You are the host. Start setup when everyone is in."
              : "You are a guest. The lobby updates live while the host controls setup."}
          </StatusNote>
          <div className="space-y-3">
            {activeRoom.players.map((player) => (
              <div
                key={player.user}
                className="flex items-center justify-between rounded-lg bg-white/8 p-3"
              >
                <span>
                  <span className="block font-bold">{player.username}</span>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/38">
                    {player.role}
                  </span>
                </span>
                <CheckCircle2 className="text-lime" size={20} />
              </div>
            ))}
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!isHost || isRoomLoading}
            onClick={handleStartSetup}
          >
            {isHost ? "Start Setup" : "Waiting For Host"}
          </Button>
        </Panel>
      </div>
    </PageScaffold>
  );
}

export function TeamSetupPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, loadRoom, lockTeams, randomizeTeams } = useRoom();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;

    loadRoom(code).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load teams");
    });
  }, [code, loadRoom]);

  const room = activeRoom;
  const isHost = Boolean(room && user && room.host === user._id);
  const playerById = new Map(room?.players.map((player) => [player.user, player]) ?? []);
  const fallbackTeams = [
    {
      id: "red",
      name: "Red Team",
      accent: "red",
      playerIds: room?.players
        .filter((_, index) => index % 2 === 0)
        .map((player) => player.user) ?? [],
      memberNames: [],
    },
    {
      id: "blue",
      name: "Blue Team",
      accent: "blue",
      playerIds: room?.players
        .filter((_, index) => index % 2 === 1)
        .map((player) => player.user) ?? [],
      memberNames: [],
    },
  ] as const;
  const teams =
    room?.teams?.some((team) => team.playerIds.length > 0) ? room.teams : fallbackTeams;

  async function handleRandomize() {
    if (!room) return;
    setError("");

    try {
      await randomizeTeams(room.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not randomize teams");
    }
  }

  async function handleLockTeams() {
    if (!room) return;
    setError("");

    try {
      await lockTeams(room.code);
      navigate("/games");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not lock teams");
    }
  }

  if (!room) {
    return (
      <PageScaffold title="Team Drama Draft" eyebrow="Team Setup">
        <Panel>
          <StatusNote tone={error ? "warn" : "info"}>
            {error || "Create or join a room before teams."}
          </StatusNote>
          <Button to="/lobby" className="mt-5">
            Back To Lobby
          </Button>
        </Panel>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title="Team Drama Draft"
      eyebrow={`Room ${room.code}`}
      subtitle={room.teamsLocked ? "Teams are locked. The drama is official." : undefined}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {teams.map((team) => (
          <Panel key={team.id}>
            <h2 className={`text-3xl font-black ${team.accent === "red" ? "text-punch" : "text-surge"}`}>
              {team.name}
            </h2>
            <div className="mt-5 space-y-3">
              {(team.memberNames?.length ?? 0) > 0 ? (
                team.memberNames?.map((memberName) => (
                  <div key={memberName} className="rounded-lg bg-white/8 p-3 font-bold">
                    {memberName}
                  </div>
                ))
              ) : team.playerIds.length ? (
                team.playerIds.map((playerId) => (
                  <div key={playerId} className="rounded-lg bg-white/8 p-3 font-bold">
                    {playerById.get(playerId)?.username ?? "Unknown Player"}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-white/10 p-3 text-sm font-bold text-white/48">
                  Waiting for players
                </div>
              )}
            </div>
          </Panel>
        ))}
      </div>
      <StatusNote tone={isHost ? "success" : "info"}>
        {isHost
          ? "Shuffle until the teams feel fair, then lock them to continue."
          : "Teams sync live. Wait for the host to lock the lineup."}
      </StatusNote>
      {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
      <div className="mt-5 flex gap-3">
        <Button
          icon={Shuffle}
          tone="orange"
          type="button"
          disabled={!isHost || isRoomLoading || room.teamsLocked}
          onClick={handleRandomize}
        >
          {isRoomLoading ? "Shuffling" : "Randomize"}
        </Button>
        <Button
          tone="cyan"
          disabled={!isHost || isRoomLoading}
          onClick={handleLockTeams}
        >
          {room.teamsLocked ? "Teams Locked" : "Lock Teams"}
        </Button>
      </div>
      {!isHost ? (
        <p className="mt-3 text-sm font-bold text-white/48">Only the host can shuffle or lock teams.</p>
      ) : null}
    </PageScaffold>
  );
}

export function GameSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, selectGame } = useRoom();
  const [error, setError] = useState("");
  const isHost = Boolean(activeRoom && user && activeRoom.host === user._id);
  const selectedGame = activeRoom?.selectedGameId ? getGameById(activeRoom.selectedGameId) : null;
  const gameCards = [...gameRegistry].sort((first, second) => {
    if (first.status === second.status) return first.name.localeCompare(second.name);
    return first.status === "MVP" ? -1 : 1;
  });

  if (isRoomLoading && !activeRoom) {
    return (
      <PageScaffold title="Pick Your Poison" eyebrow="Game Registry">
        <Panel>
          <StatusNote>Recovering your active room...</StatusNote>
        </Panel>
      </PageScaffold>
    );
  }

  async function handleSelectGame(gameId: string) {
    if (!activeRoom) {
      setError("Create or join a room before selecting a game");
      return;
    }

    const game = getGameById(gameId);
    if (game?.status !== "MVP") {
      setError("That game is in the library for later. Pick a Play Live game for this room.");
      return;
    }

    setError("");

    try {
      await selectGame(activeRoom.code, gameId);
      navigate("/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not select game");
    }
  }

  return (
    <PageScaffold
      title="Pick Your Poison"
      eyebrow={activeRoom ? `Room ${activeRoom.code}` : "Game Registry"}
      subtitle={
        activeRoom?.selectedGameId
          ? `Selected: ${selectedGame?.name ?? activeRoom.selectedGameId}`
          : undefined
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gameCards.map((game) => (
          <Panel
            key={game.id}
            className={`${game.status === "MVP" ? "border-surge/40" : "opacity-70"} ${
              activeRoom?.selectedGameId === game.id ? "border-flare/60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-black">{game.name}</h2>
              <span
                className={`rounded-md px-2 py-1 text-xs font-black ${
                  game.status === "MVP"
                    ? "border border-lime/25 bg-lime/10 text-lime"
                    : "bg-white/8 text-white/46"
                }`}
              >
                {game.status === "MVP" ? "Play Live" : "Coming Later"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">{game.description}</p>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-flare">
              {game.difficulty}
            </p>
            <Button
              type="button"
              tone={activeRoom?.selectedGameId === game.id ? "orange" : "ghost"}
              className="mt-5 w-full"
              disabled={!isHost || isRoomLoading || game.status !== "MVP"}
              onClick={() => handleSelectGame(game.id)}
            >
              {game.status !== "MVP"
                ? "Coming Later"
                : activeRoom?.selectedGameId === game.id
                  ? "Selected"
                  : "Select"}
            </Button>
          </Panel>
        ))}
      </div>
      <div className="mt-5">
        <StatusNote tone={isHost ? "success" : "info"}>
          {isHost
            ? "Pick a Play Live game for this room. Future games stay in the library for later expansion."
            : "Only the host can choose the game. Your screen will update when they pick."}
        </StatusNote>
      </div>
      {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
      {!isHost ? (
        <p className="mt-4 text-sm font-bold text-white/48">Only the host can choose the game.</p>
      ) : null}
      <Button to="/categories" className="mt-5" disabled={!selectedGame || selectedGame.status !== "MVP"}>
        Continue
      </Button>
    </PageScaffold>
  );
}

export function CategorySelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, selectCategory } = useRoom();
  const [error, setError] = useState("");
  const isHost = Boolean(activeRoom && user && activeRoom.host === user._id);
  const selectedGame = activeRoom?.selectedGameId ? getGameById(activeRoom.selectedGameId) : null;
  const categories = selectedGame?.categories ?? gameCategories;

  if (isRoomLoading && !activeRoom) {
    return (
      <PageScaffold title="Choose the Vibe" eyebrow="Categories">
        <Panel>
          <StatusNote>Recovering your active room...</StatusNote>
        </Panel>
      </PageScaffold>
    );
  }

  async function handleSelectCategory(category: string) {
    if (!activeRoom) {
      setError("Create or join a room before selecting a category");
      return;
    }

    setError("");

    try {
      await selectCategory(activeRoom.code, category);
      navigate("/intro");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not select category");
    }
  }

  return (
    <PageScaffold
      title="Choose the Vibe"
      eyebrow={selectedGame?.name ?? "Categories"}
      subtitle={activeRoom?.selectedCategory ? `Selected: ${activeRoom.selectedCategory}` : undefined}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Panel
            key={category}
            className={
              activeRoom?.selectedCategory === category
                ? "border-flare/60"
                : index < 3
                  ? "border-surge/35"
                  : ""
            }
          >
            <p className="text-lg font-black">{category}</p>
            <Button
              type="button"
              tone={activeRoom?.selectedCategory === category ? "orange" : "ghost"}
              className="mt-4 w-full"
              disabled={!isHost || isRoomLoading || !activeRoom?.selectedGameId}
              onClick={() => handleSelectCategory(category)}
            >
              {activeRoom?.selectedCategory === category ? "Selected" : "Select"}
            </Button>
          </Panel>
        ))}
      </div>
      <div className="mt-5">
        <StatusNote tone={isHost ? "success" : "info"}>
          {isHost
            ? "Choose the category for the selected game."
            : "Only the host can choose the category. This page updates live."}
        </StatusNote>
      </div>
      {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
      {!isHost ? (
        <p className="mt-4 text-sm font-bold text-white/48">Only the host can choose the category.</p>
      ) : null}
      <Button to="/intro" className="mt-5" disabled={!activeRoom?.selectedCategory}>
        Lock Categories
      </Button>
    </PageScaffold>
  );
}

export function GameIntroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeRoom } = useRoom();
  const { isRoomLoading, startGameplay } = useRoom();
  const [error, setError] = useState("");
  const game = activeRoom?.selectedGameId
    ? getGameById(activeRoom.selectedGameId) ?? getPlayableGames()[0]
    : getPlayableGames()[0];
  const isHost = Boolean(activeRoom && user && activeRoom.host === user._id);
  const canStartLiveGame = Boolean(
    activeRoom?.selectedGameId && activeRoom.selectedCategory && game.status === "MVP",
  );

  async function handleStartGameplay() {
    if (!activeRoom) {
      setError("Create or join a room before starting");
      return;
    }

    if (game.status !== "MVP") {
      setError("This future game is not live yet. Choose a Play Live game.");
      return;
    }

    if (!activeRoom.selectedCategory) {
      setError("Select a category before starting");
      return;
    }

    setError("");

    try {
      await startGameplay(activeRoom.code);
      navigate(`/play/${activeRoom.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start gameplay");
    }
  }

  return (
    <PageScaffold
      title="Round Intro"
      eyebrow={activeRoom?.selectedCategory ?? "Rules Briefing"}
      subtitle={activeRoom ? `Room ${activeRoom.code}` : undefined}
    >
      <Panel>
        <StatusNote tone={game.status === "MVP" ? (isHost ? "success" : "info") : "warn"}>
          {game.status !== "MVP"
            ? "This future game is in the library, but the live version is not turned on yet."
            : isHost
              ? "Start Game creates the backend round and sends everyone to the live gameplay screen."
              : "Read the rules while the host starts the game."}
        </StatusNote>
        <h2 className="text-3xl font-black">{game.name}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-white/66">{game.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {game.rules.map((rule) => (
            <div key={rule} className="rounded-lg border border-white/10 p-4 font-black">
              {rule}
            </div>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
        <Button
          type="button"
          className="mt-6"
          disabled={!isHost || isRoomLoading || !canStartLiveGame}
          onClick={handleStartGameplay}
        >
          {isRoomLoading ? "Starting" : "Start Game"}
        </Button>
        {!canStartLiveGame && isHost ? (
          <Button to="/games" tone="ghost" className="ml-0 mt-3 sm:ml-3">
            Choose Play Live Game
          </Button>
        ) : null}
        {!isHost ? (
          <p className="mt-3 text-sm font-bold text-white/48">Only the host can start the game.</p>
        ) : null}
      </Panel>
    </PageScaffold>
  );
}

export function GameplayPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const {
    activeRoom,
    endRound,
    isRoomLoading,
    loadRoom,
    submitGameplayAction,
    switchGameplayTeam,
  } = useRoom();
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [sentTimeUp, setSentTimeUp] = useState(false);

  useEffect(() => {
    if (!code) return;

    loadRoom(code).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load gameplay");
    });
  }, [code, loadRoom]);

  const room = activeRoom;
  const game = room?.selectedGameId ? getGameById(room.selectedGameId) : null;
  const promptIndex = room?.gameplay?.currentPromptIndex ?? 0;
  const currentCard = game?.sampleData[promptIndex % game.sampleData.length];
  const activeTeam = room?.teams.find((team) => team.id === room.gameplay?.activeTeamId);
  const activeTeamMembers = activeTeam?.memberNames?.length
    ? activeTeam.memberNames
    : activeTeam?.playerIds
        .map((playerId) => room?.players.find((player) => player.user === playerId)?.username)
        .filter((name): name is string => Boolean(name)) ?? [];
  const isHost = Boolean(room && user && room.host === user._id);

  useEffect(() => {
    if (!room?.gameplay?.roundEndsAt || room.gameplay.phase !== "playing") {
      setRemainingSeconds(null);
      setSentTimeUp(false);
      return;
    }

    function tick() {
      if (!room?.gameplay?.roundEndsAt) return;

      const nextRemaining = Math.max(
        0,
        Math.ceil((new Date(room.gameplay.roundEndsAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0 && isHost && !sentTimeUp) {
        setSentTimeUp(true);
        endRound(room.code, "time-up")
          .then(() => navigate(`/round-result/${room.code}`))
          .catch((err) => {
            setError(err instanceof Error ? err.message : "Could not end round");
          });
      }
    }

    tick();
    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, [endRound, isHost, navigate, room?.code, room?.gameplay?.phase, room?.gameplay?.roundEndsAt, sentTimeUp]);

  useEffect(() => {
    if (room?.gameplay?.phase === "round-result") {
      navigate(`/round-result/${room.code}`);
    }
  }, [navigate, room?.code, room?.gameplay?.phase]);

  async function handleAction(action: "correct" | "skip") {
    if (!room) return;
    setError("");

    try {
      await submitGameplayAction(room.code, action);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit action");
    }
  }

  async function handleSwitchTeam() {
    if (!room) return;
    setError("");

    try {
      await switchGameplayTeam(room.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not switch team");
    }
  }

  async function handleEndRound() {
    if (!room) return;
    setError("");

    try {
      await endRound(room.code, "manual");
      navigate(`/round-result/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not end round");
    }
  }

  if (room?.gameplay?.isActive && room.gameplay.phase === "playing" && game && currentCard) {
    return (
      <PageScaffold
        title={game.name}
        eyebrow={activeTeam?.name ?? "Active Team"}
        subtitle={`Room ${room.code} | Round ${room.gameplay.round} | ${room.selectedCategory ?? "Mixed"}`}
      >
      <Panel className="text-center">
          <StatusNote tone={isHost ? "success" : "info"}>
            {isHost
              ? "You control scoring. Correct/Skip advances the shared card for everyone."
              : "Watch the card and help your team. The host controls scoring."}
          </StatusNote>
          {activeTeamMembers.length ? (
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {activeTeamMembers.map((memberName) => (
                <span
                  key={memberName}
                  className="rounded-md border border-white/10 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/70"
                >
                  {memberName}
                </span>
              ))}
            </div>
          ) : null}
          <p className="text-xs font-black uppercase tracking-[0.26em] text-surge">
            Current Card
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-6xl">
            {currentCard.prompt}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/62">
            {currentCard.helperText}
          </p>
          <p className="mt-4 inline-flex rounded-md border border-lime/25 bg-lime/10 px-3 py-2 text-sm font-black text-lime">
            Answer: {currentCard.answer}
          </p>
          <p className="mt-4 text-5xl font-black text-flare sm:text-6xl">
            {remainingSeconds === 0 ? "Time is up!" : `${remainingSeconds ?? room.gameplay.roundDurationSeconds}s`}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Red Score", room.gameplay.scores.red],
              ["Blue Score", room.gameplay.scores.blue],
              ["Red Correct", room.gameplay.correct.red],
              ["Blue Correct", room.gameplay.correct.blue],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/42">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              icon={Check}
              tone="green"
              type="button"
              className="w-full"
              disabled={!isHost || isRoomLoading}
              onClick={() => handleAction("correct")}
            >
              Correct
            </Button>
            <Button
              icon={SkipForward}
              tone="orange"
              type="button"
              className="w-full"
              disabled={!isHost || isRoomLoading}
              onClick={() => handleAction("skip")}
            >
              Skip
            </Button>
            <Button
              tone="purple"
              type="button"
              className="w-full"
              disabled={!isHost || isRoomLoading}
              onClick={handleSwitchTeam}
            >
              Switch Team
            </Button>
            <Button
              tone="ghost"
              type="button"
              className="w-full"
              disabled={!isHost || isRoomLoading}
              onClick={handleEndRound}
            >
              End Round
            </Button>
          </div>
          {!isHost ? (
            <p className="mt-3 text-sm font-bold text-white/48">Only the host controls scoring.</p>
          ) : null}
        </Panel>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold title="Playable Game Demos" eyebrow="Practice Mode">
      {error ? <p className="mb-4 text-sm font-bold text-punch">{error}</p> : null}
      <div className="space-y-5">
        {getPlayableGames().map((game) => (
          <GamePlayer key={game.id} game={game} />
        ))}
      </div>
    </PageScaffold>
  );
}

export function RoundResultPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, loadRoom, nextRound } = useRoom();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;

    loadRoom(code).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load result");
    });
  }, [code, loadRoom]);

  const room = activeRoom;
  const result = room?.gameplay?.lastRoundResult;
  const team = room?.teams.find((item) => item.id === result?.teamId);
  const isHost = Boolean(room && user && room.host === user._id);

  async function handleNextRound() {
    if (!room) return;
    setError("");

    try {
      await nextRound(room.code);
      navigate(`/play/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start next round");
    }
  }

  return (
    <PageScaffold
      title={result?.endedReason === "time-up" ? "Time Is Up" : "That Was Loud"}
      eyebrow={team?.name ?? "Round Result"}
      subtitle={room ? `Room ${room.code}` : undefined}
    >
      <Panel>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Correct", String(result?.correct ?? 0)],
            ["Skips", String(result?.skips ?? 0)],
            ["Score", String(result?.score ?? 0)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white/8 p-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/42">
                {label}
              </p>
              <p className="mt-2 text-4xl font-black">{value}</p>
            </div>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            icon={ArrowRight}
            disabled={!isHost || isRoomLoading}
            onClick={handleNextRound}
          >
            Next Round
          </Button>
          <Button to={room ? `/leaderboard/${room.code}` : "/leaderboard"} icon={Trophy} tone="orange">
          Show Scores
          </Button>
        </div>
      </Panel>
    </PageScaffold>
  );
}

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { activeRoom, finishGame, isRoomLoading, loadRoom } = useRoom();
  const { refreshUser, token, user } = useAuth();
  const [error, setError] = useState("");
  const [globalPlayers, setGlobalPlayers] = useState<LeaderboardPlayer[]>([]);

  useEffect(() => {
    if (!code) return;
    void loadRoom(code);
  }, [code, loadRoom]);

  useEffect(() => {
    if (code || !token) return;
    fetchLeaderboard(token).then((response) => setGlobalPlayers(response.players)).catch(() => {});
  }, [code, token]);

  const scores = (activeRoom?.teams ?? [])
    .map((team) => [
      team.name,
      activeRoom?.gameplay?.scores[team.id] ?? 0,
      team.id === "red" ? "text-punch" : "text-surge",
    ] as const)
    .sort((first, second) => second[1] - first[1]);
  const isHost = Boolean(activeRoom && user && activeRoom.host === user._id);

  async function handleFinishGame() {
    if (!activeRoom) return;
    setError("");

    try {
      await finishGame(activeRoom.code);
      await refreshUser();
      navigate(`/winner/${activeRoom.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not finish game");
    }
  }

  if (!code) {
    return (
      <PageScaffold title="Global Winners" eyebrow="Leaderboard">
        <Panel>
          <div className="space-y-3">
            {globalPlayers.length ? (
              globalPlayers.map((player, index) => (
                <div
                  key={player._id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-white/10 font-black">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-xl font-black">{player.username}</span>
                      <span className="text-sm text-white/48">
                        {player.wins} wins | {player.gamesPlayed} games
                      </span>
                    </span>
                  </div>
                  <span className="text-2xl font-black">{player.totalScore}</span>
                </div>
              ))
            ) : (
              <p className="text-white/58">Finish a game to light up the rankings.</p>
            )}
          </div>
        </Panel>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold title="Scoreboard Drama" eyebrow={activeRoom ? `Room ${activeRoom.code}` : "Leaderboard"}>
      <Panel>
        <div className="space-y-3">
          {scores.map(([team, score, color], index) => (
            <div
              key={team as string}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 p-4"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-10 place-items-center rounded-lg bg-white/10 font-black">
                  {index + 1}
                </span>
                <span className={`text-xl font-black ${color}`}>{team}</span>
              </div>
              <span className="text-2xl font-black">{score}</span>
            </div>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
        <Button
          type="button"
          icon={Trophy}
          tone="orange"
          className="mt-6"
          disabled={!isHost || isRoomLoading || !activeRoom?.gameplay?.isActive}
          onClick={handleFinishGame}
        >
          Finish Game
        </Button>
      </Panel>
    </PageScaffold>
  );
}

export function FinalWinnerPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const { user } = useAuth();
  const { activeRoom, isRoomLoading, loadRoom, resetRoom } = useRoom();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    loadRoom(code).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load final result");
    });
  }, [code, loadRoom]);

  const room = activeRoom;
  const result = room?.finalResult;
  const isDraw = result?.winnerTeamId === "draw";
  const winnerTitle = isDraw
    ? "Everybody Cooked"
    : `${result?.winnerTeamName ?? "Winning Team"} is cooking!`;
  const loserSubtitle = isDraw
    ? "No one got cooked. Suspiciously balanced chaos."
    : `${result?.loserTeamName ?? "The other team"} got cooked.`;
  const isHost = Boolean(room && user && room.host === user._id);

  async function handleResetRoom() {
    if (!room) return;
    setError("");

    try {
      await resetRoom(room.code);
      navigate(`/lobby/${room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset room");
    }
  }

  return (
    <PageScaffold
      title={winnerTitle}
      eyebrow="Final Winner"
      subtitle={loserSubtitle}
    >
      <Panel className="text-center">
        <Trophy className="mx-auto text-flare" size={72} />
        <h2 className="mt-5 text-5xl font-black">
          {isDraw ? "Draw Game" : `${result?.winnerTeamName ?? "Winner"} Wins`}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-white/66">
          {isDraw
            ? `Final score: ${result?.scores.red ?? 0} - ${result?.scores.blue ?? 0}.`
            : `${result?.winnerTeamName ?? "Winner"} is cooking, ${result?.loserTeamName ?? "the loser"} is cooked.`}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-punch">Red</p>
            <p className="mt-2 text-4xl font-black">{result?.scores.red ?? 0}</p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-surge">Blue</p>
            <p className="mt-2 text-4xl font-black">{result?.scores.blue ?? 0}</p>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm font-bold text-punch">{error}</p> : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/home" icon={Home}>
            Back Home
          </Button>
          <Button
            type="button"
            tone="ghost"
            disabled={!isHost || isRoomLoading || !room}
            onClick={handleResetRoom}
          >
            Reset Room
          </Button>
        </div>
      </Panel>
    </PageScaffold>
  );
}
