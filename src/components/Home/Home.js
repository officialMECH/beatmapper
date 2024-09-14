import React from "react";
import { connect } from "react-redux";

import { getAllSongsChronologically, getProcessingImport } from "$/store/reducers/songs.reducer";
import { getIsNewUser } from "$/store/reducers/user.reducer";

import AddSongForm from "../AddSongForm";
import BasicLayout from "../BasicLayout";
import Modal from "../Modal";

import ImportMapForm from "../ImportMapForm";
import FirstTimeHome from "./FirstTimeHome";
import ReturningHome from "./ReturningHome";

const Home = ({ isNewUser, songs, isProcessingImport }) => {
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

const mapStateToProps = (state) => {
	return {
		isNewUser: getIsNewUser(state),
		songs: getAllSongsChronologically(state),
		isProcessingImport: getProcessingImport(state),
	};
};

export default connect(mapStateToProps)(Home);
