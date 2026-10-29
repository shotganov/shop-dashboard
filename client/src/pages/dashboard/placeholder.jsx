import { Card, CardBody, Typography } from "@material-tailwind/react";

export function Placeholder() {
  return (
    <div className="mb-8 mt-12">
      <Card>
        <CardBody>
          <Typography className="font-normal text-blue-gray-500">
            Раздел в разработке.
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default Placeholder;
