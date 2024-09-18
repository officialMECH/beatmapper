import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { dismissPrompt } from "$/store/actions";
import { getSeenPrompts } from "$/store/reducers/user.reducer";

import Paragraph from "../Paragraph";
import UnobtrusivePrompt from "../UnobtrusivePrompt";

// TODO: compose prompts in mdx for better dx
const PROMPTS = [
	{
		id: "bsmg",
		title: "Beatmapper lives on!",
		contents: () => (
			<>
				<Paragraph>
					Good news, everyone — The kind folks at the Beat Saber Modding Group have agreed to <ExternalLink href="https://github.com/bsmg/beatmapper">maintain this project</ExternalLink>. Beatmapper will remain online!
				</Paragraph>
			</>
		),
	},
];

const EditorPrompts = () => {
	const prompt = useSelector((state) => {
		const seenPrompts = getSeenPrompts(state);
		const unseenPrompts = PROMPTS.filter((prompt) => !seenPrompts.includes(prompt.id));
		return unseenPrompts[0];
	});
	const dispatch = useDispatch();

	if (!prompt) {
		return null;
	}

	return (
		<UnobtrusivePrompt title={prompt.title} onDismiss={() => dispatch(dismissPrompt({ promptId: prompt.id }))}>
			{prompt.contents()}
		</UnobtrusivePrompt>
	);
};

const ExternalLink = styled.a`
  color: inherit;
`;

export default EditorPrompts;
