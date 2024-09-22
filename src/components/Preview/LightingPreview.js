/**
 * This component holds all of the internal 3D stuff, everything
 * you see in the main part of the map editor.
 *
 * It does NOT include the 2D stuff like the toolbar or the track
 * controls.
 */

import { useFrame } from "@react-three/fiber";
import React from "react";
import { useSelector } from "react-redux";

import { Controls } from "$/services/controls.service";
import { getGraphicsLevel, getIsPlaying, getSelectedSong } from "$/store/selectors";
import { Quality } from "$/types";

import { Bloom, NoBloom } from "../BloomEffect";
import Fog from "../Fog";
import StaticEnvironment from "../StaticEnvironment";
import AmbientLighting from "./AmbientLighting";
import BackLaser from "./BackLaser";
import LargeRings from "./LargeRings";
import PrimaryLight from "./PrimaryLight";
import SideLaser from "./SideLaser";
import SmallRings from "./SmallRings";

const LightingPreview = () => {
	const song = useSelector(getSelectedSong);
	const isPlaying = useSelector(getIsPlaying);
	const graphicsLevel = useSelector(getGraphicsLevel);

	const controls = React.useRef(null);

	const isBlooming = graphicsLevel === Quality.HIGH;

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
			<Fog renderForGraphics={Quality.MEDIUM} strength={0.005} />
		</>
	);
};

export default LightingPreview;
