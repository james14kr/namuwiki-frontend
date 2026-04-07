import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { cn } from "@/utils/tw.utils";
import { isNullOrEmpty } from "@/utils/validate";

export interface BreadcrumbInfo {
  title: string;
  to: string;
}

interface Props {
  appName: string;
  data: BreadcrumbInfo[];
  firstItemClass?: string;
  itemClass?: string;
}

const AppBreadcrumb = ({ appName, data, firstItemClass, itemClass }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          className={cn("hidden md:block", firstItemClass && firstItemClass)}
        >
          <BreadcrumbLink href="/">{appName}</BreadcrumbLink>
        </BreadcrumbItem>
        {data.length > 0 &&
          data.map((x, i) => {
            return (
              <React.Fragment key={i}>
                <BreadcrumbSeparator
                  key={`crumbs-separator-${x.to}`}
                  className={cn("hidden md:block", itemClass && itemClass)}
                />
                <BreadcrumbItem key={`crumbs-item-${x.to}`}>
                  {i === data.length - 1 ? (
                    <BreadcrumbPage>{x.title}</BreadcrumbPage>
                  ) : x.to === "#" || isNullOrEmpty(x.to) ? (
                    x.title
                  ) : (
                    <BreadcrumbLink href={x.to}>{x.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
