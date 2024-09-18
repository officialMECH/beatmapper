import { download as fileIcon } from "react-icons-kit/feather/download";
import { useDispatch, useSelector } from "react-redux";

import { processImportedMap } from "$/services/packaging.service";
import { cancelImportingSong, importExistingSong, startImportingSong } from "$/store/actions";
import { getAllSongs } from "$/store/reducers/songs.reducer";

import FileUploader from "../FileUploader";

const ImportMap = ({ onImport, onCancel, height }) => {
	const songs = useSelector(getAllSongs);
	const dispatch = useDispatch();
	const songIds = songs.map((song) => song.id);

	const handleSelectExistingMap = async (file) => {
		dispatch(startImportingSong());

		try {
			const songData = await processImportedMap(file, songIds);

			dispatch(importExistingSong({ songData }));
			onImport();
		} catch (err) {
			console.error("Could not import map:", err);
			dispatch(cancelImportingSong());
			onCancel();
		}
	};

	return <FileUploader onSelectFile={handleSelectExistingMap} icon={fileIcon} height={height} title="Import existing map" description="Select a .zip file" />;
};

export default ImportMap;
