import React from "react";
import { useSelector } from "react-redux";

import { getAllSongsChronologically, getIsNewUser, getProcessingImport } from "$/store/selectors";

import AddSongForm from "../AddSongForm";
import BasicLayout from "../BasicLayout";
import ImportMapForm from "../ImportMapForm";
import Modal from "../Modal";
import FirstTimeHome from "./FirstTimeHome";
import ReturningHome from "./ReturningHome";

const Home = () => {
	const isNewUser = useSelector(getIsNewUser);
	const songs = useSelector(getAllSongsChronologically);
	const isProcessingImport = useSelector(getProcessingImport);

	const [modal, setModal] = React.useState(false);

	return (
		<BasicLayout>
			{isNewUser ? <FirstTimeHome setModal={setModal} /> : <ReturningHome songs={songs} isProcessingImport={isProcessingImport} setModal={setModal} />}

			<Modal isVisible={modal === "create-new-song"} clickBackdropToDismiss={false} onDismiss={() => setModal(null)}>
				<AddSongForm />
			</Modal>
			<Modal isVisible={modal === "import-map"} onDismiss={() => setModal(null)}>
				<ImportMapForm onImport={() => setModal(null)} onCancel={() => setModal(null)} />
			</Modal>
		</BasicLayout>
	);
};

export default Home;
