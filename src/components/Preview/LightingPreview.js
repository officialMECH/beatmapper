/**
 * This component holds all of the internal 3D stuff, everything
 * you see in the main part of the map editor.
 *
 * It does NOT include the 2D stuff like the toolbar or the track
 * controls.
 */

import { useFrame } from "@react-three/fiber";
import React from "react";
import { connect } from "react-redux";

import Controls from "../../controls";
import { getIsPlaying } from "../../reducers/navigation.reducer";
import { getSelectedSong } from "../../reducers/songs.reducer";
import { getGraphicsLevel } from "../../reducers/user.reducer";

import { Bloom, NoBloom } from "../BloomEffect";
import Fog from "../Fog";
import StaticEnvironment from "../StaticEnvironment";
import AmbientLighting from "./AmbientLighting";
import BackLaser from "./BackLaser";
import LargeRings from "./LargeRings";
import PrimaryLight from "./PrimaryLight";
import SideLaser from "./SideLaser";
import SmallRings from "./SmallRings";

const LightingPreview = ({ song, isPlaying, graphicsLevel }) => {
	const controls = React.useRef(null);

	const isBlooming = graphicsLevel === "high";

	// Controls to move around the space.
	useFrame(({ canvas, scene, camera }) => {
		if (!controls.current) {
			controls.current = new Controls(camera);
			scene.add(controls.current.getObject());
		} else {
			controls.current.update();
		}
	});

	const lights = (
		<>
			<SideLaser song={song} isPlaying={isPlaying} side="left" />
			<SideLaser song={song} isPlaying={isPlaying} side="right" />
			<BackLaser song={song} isPlaying={isPlaying} />
			<LargeRings song={song} isPlaying={isPlaying} />
			<SmallRings song={song} isPlaying={isPlaying} />
			<PrimaryLight song={song} isPlaying={isPlaying} isBlooming={isBlooming} />
		</>
	);

	const environment = (
		<>
			<StaticEnvironment />
			<AmbientLighting includeSpotlight={!isBlooming} />
		</>
	);

	if (isBlooming) {
		return (
			<>
				<Bloom>{lights}</Bloom>

				<NoBloom>{environment}</NoBloom>
			</>
		);
	}

	return (
		<>
			{lights}
			{environment}
			<Fog renderForGraphics="medium" strength={0.005} />
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		song: getSelectedSong(state),
		isPlaying: getIsPlaying(state),
		graphicsLevel: getGraphicsLevel(state),
	};
};

export default connect(mapStateToProps)(LightingPreview);
