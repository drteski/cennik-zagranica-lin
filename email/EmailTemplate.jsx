import { Html, Section, Text, Row, Column } from "jsx-email";
import { format } from "date-fns";

const EmailTemplate = ({ data, locale, name, currency }) => {
	return (
		<Html>
			<Text>
				Price Changes for {name} {format(new Date(), "dd-MM-yyyy")}
			</Text>
			<Section>
				<Row style={{ borderBottom: "1px solid black" }}>
					<Column
						style={{
							padding: "3px 6px",
							color: "black",
							textAlign: "left",
							width: "10%",
							fontWeight: "700",
						}}
					>
						ID
					</Column>
					<Column
						style={{
							padding: "3px 6px",
							color: "black",
							textAlign: "left",
							width: "10%",
							fontWeight: "700",
						}}
					>
						SKU
					</Column>
					<Column
						style={{
							padding: "3px 6px",
							color: "black",
							textAlign: "left",
							width: "10%",
							fontWeight: "700",
						}}
					>
						EAN
					</Column>
					<Column
						style={{
							padding: "3px 6px",
							color: "black",
							textAlign: "left",
							width: "50%",
							fontWeight: "700",
						}}
					>
						TITLE
					</Column>
					<Column
						style={{
							padding: "3px 6px",
							color: "black",
							textAlign: "right",
							width: "10%",
							fontWeight: "700",
						}}
					>
						NEW PRICE
					</Column>
				</Row>
				{data.map((item) => {
					if (typeof item === "undefined") return;
					return (
						<Row style={{ borderBottom: "1px solid black" }} key={item.ean}>
							<Column
								style={{
									padding: "3px 6px",
									color: "black",
									textAlign: "left",
									width: "10%",
									textTransform: "uppercase",
								}}
							>
								{item.variantId}
							</Column>
							<Column
								style={{
									padding: "3px 6px",
									color: "black",
									textAlign: "left",
									width: "10%",
									textTransform: "uppercase",
								}}
							>
								{item.sku}
							</Column>
							<Column
								style={{
									padding: "3px 6px",
									color: "black",
									textAlign: "left",
									width: "10%",
									textTransform: "uppercase",
								}}
							>
								{item.ean}
							</Column>
							<Column
								style={{
									padding: "3px 6px",
									color: "black",
									textAlign: "left",
									width: "50%",
									textTransform: "uppercase",
								}}
							>
								{item.title}
							</Column>
							<Column
								style={{
									padding: "3px 6px",
									color: "black",
									textAlign: "right",
									width: "10%",
								}}
							>
								{new Intl.NumberFormat(locale, {
									style: "currency",
									currency: currency,
								}).format(parseFloat(item.newPrice))}
							</Column>
						</Row>
					);
				})}
			</Section>
		</Html>
	);
};

export default EmailTemplate;
