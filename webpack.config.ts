import dotenv from "dotenv";
import path from "path";
import webpack from "webpack";

dotenv.config();

const mode = process.env.NODE_ENV === "prod" ? "production" : "development";

const config: webpack.Configuration = {
  mode,
  entry: {
    main: path.join(process.cwd(), "src", "client", "index.ts"),
    lobby: path.join(process.cwd(), "src", "client", "lobby.ts"),
    game: path.join(process.cwd(), "src", "client", "game.ts"),
    action: path.join(process.cwd(), "src", "client", "Action.ts"),
    card: path.join(process.cwd(), "src", "client", "Card.ts"),
    player: path.join(process.cwd(), "src", "client", "Player.ts"),
    player_game_state: path.join(
      process.cwd(),
      "src",
      "client",
      "PlayerGameState.ts",
    ),
  },
  output: {
    path: path.join(process.cwd(), "public", "js"),
    filename: "[name].js",
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
};

export default config;
